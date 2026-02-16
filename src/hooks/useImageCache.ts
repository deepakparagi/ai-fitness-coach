"use client";
import { useState, useEffect, useCallback } from "react";

interface CachedImage {
    url: string;
    timestamp: number;
}

interface ImageCache {
    [key: string]: CachedImage;
}

const CACHE_KEY = "ai-fitness-image-cache";
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours
const MAX_CACHE_SIZE = 50; // Maximum number of cached images

export function useImageCache() {
    const [cache, setCache] = useState<ImageCache>({});

    // Load cache from localStorage on mount
    useEffect(() => {
        try {
            const stored = localStorage.getItem(CACHE_KEY);
            if (stored) {
                const parsed: ImageCache = JSON.parse(stored);
                // Clean expired entries
                const now = Date.now();
                const cleaned = Object.entries(parsed).reduce((acc, [key, value]) => {
                    if (now - value.timestamp < CACHE_DURATION) {
                        acc[key] = value;
                    }
                    return acc;
                }, {} as ImageCache);
                setCache(cleaned);
            }
        } catch (error) {
            console.error("Failed to load image cache:", error);
        }
    }, []);

    // Save cache to localStorage whenever it changes
    useEffect(() => {
        try {
            localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
        } catch (error) {
            console.error("Failed to save image cache:", error);
            // If quota exceeded, clear old entries
            clearOldEntries();
        }
    }, [cache]);

    const clearOldEntries = useCallback(() => {
        const entries = Object.entries(cache);
        if (entries.length > MAX_CACHE_SIZE) {
            // Sort by timestamp and keep only the most recent
            const sorted = entries.sort((a, b) => b[1].timestamp - a[1].timestamp);
            const newCache = Object.fromEntries(sorted.slice(0, MAX_CACHE_SIZE));
            setCache(newCache);
        }
    }, [cache]);

    const getCachedImage = useCallback(
        (key: string): string | null => {
            const cached = cache[key];
            if (!cached) return null;

            const now = Date.now();
            if (now - cached.timestamp > CACHE_DURATION) {
                // Expired, remove it
                const newCache = { ...cache };
                delete newCache[key];
                setCache(newCache);
                return null;
            }

            return cached.url;
        },
        [cache]
    );

    const setCachedImage = useCallback(
        (key: string, url: string) => {
            setCache((prev) => ({
                ...prev,
                [key]: {
                    url,
                    timestamp: Date.now(),
                },
            }));
        },
        []
    );

    const clearCache = useCallback(() => {
        setCache({});
        try {
            localStorage.removeItem(CACHE_KEY);
        } catch (error) {
            console.error("Failed to clear cache:", error);
        }
    }, []);

    const removeCachedImage = useCallback((key: string) => {
        setCache((prev) => {
            const newCache = { ...prev };
            delete newCache[key];
            return newCache;
        });
    }, []);

    return {
        getCachedImage,
        setCachedImage,
        clearCache,
        removeCachedImage,
        cacheSize: Object.keys(cache).length,
    };
}
