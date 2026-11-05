import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  normalizeEmail, makeEmailToken, verifyEmailToken, actionUrl,
  parsePosts, pickNewPosts, notifiablePosts, buildPostsEmail, absoluteHref,
} from '../api/_lib/subscribe.js';

const SECRET = 'test-secret';
const SITE = 'https://example.test';

test('normalizeEmail lowercases, trims and rejects junk', () => {
  assert.equal(normalizeEmail('  An.Nguyen@Gmail.COM '), 'an.nguyen@gmail.com');
  assert.equal(normalizeEmail('no-at-sign'), null);
  assert.equal(normalizeEmail('a@b'), null);
  assert.equal(normalizeEmail('a b@c.com'), null);
  assert.equal(normalizeEmail(`${'x'.repeat(250)}@a.com`), null);
  assert.equal(normalizeEmail(undefined), null);
});

test('email tokens verify only for the same purpose, email and secret', () => {
  const tok = makeEmailToken(SECRET, 'confirm', 'a@b.com');
  assert.equal(verifyEmailToken(SECRET, 'confirm', 'a@b.com', tok), true);
  assert.equal(verifyEmailToken(SECRET, 'unsub', 'a@b.com', tok), false);
  assert.equal(verifyEmailToken(SECRET, 'confirm', 'c@b.com', tok), false);
  assert.equal(verifyEmailToken('other', 'confirm', 'a@b.com', tok), false);
  assert.equal(verifyEmailToken(SECRET, 'confirm', 'a@b.com', undefined), false);
});

test('actionUrl builds a verifiable link', () => {
  const url = new URL(actionUrl(SITE, SECRET, 'unsub', 'a+x@b.com'));
  assert.equal(url.pathname, '/api/subscribe');
  assert.equal(url.searchParams.get('email'), 'a+x@b.com');
  assert.equal(verifyEmailToken(SECRET, 'unsub', 'a+x@b.com', url.searchParams.get('t')), true);
});

test('parsePosts reads the real assets/posts.js', () => {
  const posts = parsePosts(readFileSync(new URL('../assets/posts.js', import.meta.url), 'utf8'));
  assert.ok(posts.length > 0);
  assert.ok(posts.every((p) => typeof p.href === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(p.date)));
});

test('parsePosts throws when CT_POSTS is missing', () => {
  assert.throws(() => parsePosts('var x = 1;'));
});

const POSTS = [
  { title: 'Cũ', href: '/old', date: '2026-10-01' },
  { title: 'Trang chứa', href: '/container', date: '2026-11-04', hideFromNews: true },
  { title: 'Mới 1', href: '/new1', date: '2026-11-03' },
  { title: 'Mới 2', href: '/new2', date: '2026-11-05' },
];

test('pickNewPosts skips notified and hideFromNews posts, newest first', () => {
  const picked = pickNewPosts(POSTS, ['/old']);
  assert.deepEqual(picked.map((p) => p.href), ['/new2', '/new1']);
  assert.equal(pickNewPosts(POSTS, notifiablePosts(POSTS).map((p) => p.href)).length, 0);
});

test('absoluteHref keeps external links and prefixes site paths', () => {
  assert.equal(absoluteHref(SITE, '/x'), `${SITE}/x`);
  assert.equal(absoluteHref(SITE, 'x'), `${SITE}/x`);
  assert.equal(absoluteHref(SITE, 'https://drive.google.com/a'), 'https://drive.google.com/a');
});

test('buildPostsEmail lists posts, escapes HTML and includes unsubscribe link', () => {
  const unsubUrl = `${SITE}/api/subscribe?action=unsub`;
  const one = buildPostsEmail([{ title: 'A <b>', href: '/a', date: '2026-11-05', desc: 'x&y' }], { siteUrl: SITE, unsubUrl });
  assert.equal(one.subject, 'Bài mới: A <b>');
  assert.match(one.html, /A &lt;b&gt;/);
  assert.match(one.html, /x&amp;y/);
  assert.match(one.html, /05\/11\/2026/);
  assert.ok(one.html.includes(unsubUrl));
  assert.ok(one.text.includes(`${SITE}/a`));
  const all = pickNewPosts(POSTS, []);
  assert.equal(buildPostsEmail(all, { siteUrl: SITE, unsubUrl }).subject.startsWith(`${all.length} bài mới`), true);
});
