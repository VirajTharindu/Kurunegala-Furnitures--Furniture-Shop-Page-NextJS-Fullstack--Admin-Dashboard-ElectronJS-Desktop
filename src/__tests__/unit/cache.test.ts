import { fetchWithCache } from '@/lib/cache';

// Mock ioredis
jest.mock('@/lib/redis', () => ({
    get: jest.fn(),
    setex: jest.fn(),
}));

import redis from '@/lib/redis';

const mockRedis = redis as jest.Mocked<typeof redis>;

describe('fetchWithCache', () => {
    afterEach(() => jest.clearAllMocks());
    afterAll(() => jest.restoreAllMocks());

    it('returns cached value on cache hit', async () => {
        mockRedis.get.mockResolvedValue(JSON.stringify({ id: '1', name: 'Sofa' }));
        const fetcher = jest.fn();

        const result = await fetchWithCache('product:1', 3600, fetcher);

        expect(result).toEqual({ id: '1', name: 'Sofa' });
        expect(fetcher).not.toHaveBeenCalled();
    });

    it('calls fetcher and stores result on cache miss', async () => {
        mockRedis.get.mockResolvedValue(null);
        mockRedis.setex.mockResolvedValue('OK');
        const fetcher = jest.fn().mockResolvedValue({ id: '2', name: 'Table' });

        const result = await fetchWithCache('product:2', 3600, fetcher);

        expect(fetcher).toHaveBeenCalledTimes(1);
        expect(mockRedis.setex).toHaveBeenCalledWith('product:2', 3600, JSON.stringify({ id: '2', name: 'Table' }));
        expect(result).toEqual({ id: '2', name: 'Table' });
    });

    it('falls back to fetcher on Redis error', async () => {
        // Suppress the expected console.error to keep test output clean
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

        mockRedis.get.mockRejectedValue(new Error('Redis down'));
        const fetcher = jest.fn().mockResolvedValue([]);

        const result = await fetchWithCache('product:all', 60, fetcher);

        expect(result).toEqual([]);
        expect(consoleSpy).toHaveBeenCalledWith(
            'Cache error for key product:all:',
            expect.any(Error)
        );

        consoleSpy.mockRestore();
    });
});
