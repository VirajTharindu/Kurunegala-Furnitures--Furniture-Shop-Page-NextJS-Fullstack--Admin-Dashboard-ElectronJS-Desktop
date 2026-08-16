/**
 * @note The block below contains polyfills for Node.js globals
 * required for Jest to function when running MSW v2.
 * @see https://mswjs.io/docs/faq#requestresponsetextencoder-is-not-defined-jest
 */
const { TextDecoder, TextEncoder } = require('node:util');
const { ReadableStream, TransformStream, WritableStream } = require('node:stream/web');
const { MessageChannel, MessagePort, BroadcastChannel } = require('node:worker_threads');

Object.defineProperties(globalThis, {
    TextDecoder: { value: TextDecoder },
    TextEncoder: { value: TextEncoder },
    ReadableStream: { value: ReadableStream },
    TransformStream: { value: TransformStream },
    WritableStream: { value: WritableStream },
    MessageChannel: { value: MessageChannel },
    MessagePort: { value: MessagePort },
    BroadcastChannel: { value: BroadcastChannel },
});

const { Blob, File } = require('node:buffer');
const { fetch, Headers, FormData, Request, Response } = require('undici');

Object.defineProperties(globalThis, {
    fetch: { value: fetch, writable: true },
    Blob: { value: Blob },
    File: { value: File },
    Headers: { value: Headers },
    FormData: { value: FormData },
    Request: { value: Request },
    Response: { value: Response },
});
