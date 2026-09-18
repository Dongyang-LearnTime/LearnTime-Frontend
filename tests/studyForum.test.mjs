import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import ts from 'typescript';

// 프로젝트에 설치된 TypeScript와 Node 테스트 러너만 사용합니다.
const source = readFileSync(new URL('../src/pages/study/forum/hooks/forumPagination.ts', import.meta.url), 'utf8');
const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } });
const { readForumRange, mergeForumMessages } = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`);
const message = id => ({ messageId: id, authorStudyMemberId: 1, authorUserId: 1, authorName: '회원', content: String(id), createdAt: '2026-09-15T14:00:00' });
const page = (ids, nextCursor = null) => ({ content: ids.map(message), nextCursor, hasNext: nextCursor !== null });

test('최초 진입은 최신 페이지만 조회합니다', async () => {
  const calls = [];
  const result = await readForumRange(async cursor => { calls.push(cursor); return page([9, 8], 8); });
  assert.deepEqual(calls, [undefined]);
  assert.equal(result.nextCursor, 8);
});

test('한 페이지를 초과하는 신규 대화도 기존 범위까지 연결합니다', async () => {
  const calls = [];
  const pages = new Map([[undefined, page([10, 9], 9)], [9, page([8, 7], 7)], [7, page([6, 5], 5)]]);
  const result = await readForumRange(async cursor => { calls.push(cursor); return pages.get(cursor); }, 5);
  assert.deepEqual(calls, [undefined, 9, 7]);
  assert.deepEqual(result.content.map(row => row.messageId), [10, 9, 8, 7, 6, 5]);
  assert.equal(result.nextCursor, 5);
});

test('삭제·차단된 행을 복원하지 않고 경계 ID가 사라져도 조회를 마칩니다', async () => {
  const pages = new Map([[undefined, page([10, 8], 8)], [8, page([6, 4], 4)]]);
  const result = await readForumRange(async cursor => pages.get(cursor), 5);
  assert.deepEqual(result.content.map(row => row.messageId), [10, 8, 6]);
  assert.equal(result.nextCursor, 6);
});

test('모든 메시지가 삭제된 경우 빈 목록으로 교체합니다', async () => {
  assert.deepEqual(await readForumRange(async () => page([]), 5), page([]));
});

test('갱신 때 경계 확인을 위해 읽은 과거 메시지가 자동으로 목록에 추가되지 않습니다', async () => {
  const pages = new Map([[undefined, page([11, 10], 10)], [10, page([9, 8], 8)]]);
  const result = await readForumRange(async cursor => pages.get(cursor), 9);
  assert.deepEqual(result.content.map(row => row.messageId), [11, 10, 9]);
  assert.equal(result.nextCursor, 9);
});

test('페이지 경계 중복을 제거하고 ID 내림차순으로 정렬합니다', () => {
  assert.deepEqual(mergeForumMessages([message(2), message(4), message(2), message(3)]).map(row => row.messageId), [4, 3, 2]);
});

test('커서가 반복되면 무한 요청을 중단합니다', async () => {
  await assert.rejects(readForumRange(async () => page([10, 9], 9), 1), /커서가 반복/);
});

test('중간 페이지 요청이 실패하면 불완전한 대화 목록을 반환하지 않습니다', async () => {
  await assert.rejects(readForumRange(async cursor => {
    if (cursor) throw new Error('network');
    return page([10, 9], 9);
  }, 1), /network/);
});
