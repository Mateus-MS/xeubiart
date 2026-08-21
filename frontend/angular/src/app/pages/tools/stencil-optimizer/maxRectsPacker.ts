export interface PackingItem {
    id: string;
    url: string;
    fileName: string;
    width: number;
    height: number;
    sizeCm: number;
}

export interface PackedItem extends PackingItem {
    x: number;
    y: number;
    rotated: boolean;
    pageIndex: number;
}

interface FreeRectangle {
    x: number;
    y: number;
    width: number;
    height: number;
}

export class MaxRectsPacker {
    private binWidth: number;
    private binHeight: number;
    private padding: number;
    private allowRotation: boolean;

    constructor(
        binWidthMm = 210, 
        binHeightMm = 297, 
        paddingMm = 5, 
        allowRotation = true
    ) {
        this.binWidth = binWidthMm - (paddingMm * 2);
        this.binHeight = binHeightMm - (paddingMm * 2);
        this.padding = paddingMm;
        this.allowRotation = allowRotation;
    }

    public pack(items: PackingItem[]): { pages: PackedItem[][]; efficiency: number[] } {
        const sorted = [...items].sort((a, b) => (b.width * b.height) - (a.width * a.height));
        
        const pages: PackedItem[][] = [];
        const efficiencies: number[] = [];
        let remaining = [...sorted];

        while (remaining.length > 0) {
            const freeRects: FreeRectangle[] = [{
                x: 0,
                y: 0,
                width: this.binWidth,
                height: this.binHeight
            }];

            const currentPage: PackedItem[] = [];
            const unplaced: PackingItem[] = [];
            const pageIndex = pages.length;

            for (const item of remaining) {
                const bestNode = this.findBestNode(item, freeRects);

                if (bestNode) {
                    const packed: PackedItem = {
                        ...item,
                        x: bestNode.x + this.padding,
                        y: bestNode.y + this.padding,
                        width: bestNode.rotated ? item.height : item.width,
                        height: bestNode.rotated ? item.width : item.height,
                        rotated: bestNode.rotated,
                        pageIndex
                    };

                    currentPage.push(packed);
                    this.splitFreeRectangles(freeRects, bestNode);
                    this.pruneFreeRectangles(freeRects);
                } else {
                    unplaced.push(item);
                }
            }

            if (currentPage.length === 0 && unplaced.length > 0) {
                const oversized = unplaced.shift()!;
                currentPage.push({
                    ...oversized,
                    x: this.padding,
                    y: this.padding,
                    width: Math.min(oversized.width, this.binWidth),
                    height: Math.min(oversized.height, this.binHeight),
                    rotated: false,
                    pageIndex
                });
            }

            const usedArea = currentPage.reduce((sum, i) => sum + (i.width * i.height), 0);
            const totalArea = this.binWidth * this.binHeight;
            efficiencies.push(Math.round((usedArea / totalArea) * 100));

            pages.push(currentPage);
            remaining = unplaced;
        }

        return { pages, efficiency: efficiencies };
    }

    private findBestNode(
        item: PackingItem, 
        freeRects: FreeRectangle[]
    ): { x: number; y: number; width: number; height: number; rotated: boolean; bestShortSideFit: number } | null {
        let bestNode: any = null;
        let bestShortSideFit = Infinity;

        for (const rect of freeRects) {
            if (rect.width >= item.width && rect.height >= item.height) {
                const leftoverX = rect.width - item.width;
                const leftoverY = rect.height - item.height;
                const shortSideFit = Math.min(leftoverX, leftoverY);

                if (shortSideFit < bestShortSideFit) {
                    bestShortSideFit = shortSideFit;
                    bestNode = { x: rect.x, y: rect.y, width: item.width, height: item.height, rotated: false };
                }
            }

            if (this.allowRotation && rect.width >= item.height && rect.height >= item.width) {
                const leftoverX = rect.width - item.height;
                const leftoverY = rect.height - item.width;
                const shortSideFit = Math.min(leftoverX, leftoverY);

                if (shortSideFit < bestShortSideFit) {
                    bestShortSideFit = shortSideFit;
                    bestNode = { x: rect.x, y: rect.y, width: item.height, height: item.width, rotated: true };
                }
            }
        }

        return bestNode;
    }

    private splitFreeRectangles(freeRects: FreeRectangle[], usedNode: { x: number; y: number; width: number; height: number }) {
        const count = freeRects.length;
        for (let i = 0; i < count; i++) {
            if (this.isIntersecting(freeRects[i], usedNode)) {
                const rect = freeRects[i];

                if (usedNode.y > rect.y && usedNode.y < rect.y + rect.height) {
                    freeRects.push({ x: rect.x, y: rect.y, width: rect.width, height: usedNode.y - rect.y });
                }
                if (usedNode.y + usedNode.height < rect.y + rect.height) {
                    freeRects.push({
                        x: rect.x,
                        y: usedNode.y + usedNode.height,
                        width: rect.width,
                        height: (rect.y + rect.height) - (usedNode.y + usedNode.height)
                    });
                }
                if (usedNode.x > rect.x && usedNode.x < rect.x + rect.width) {
                    freeRects.push({ x: rect.x, y: rect.y, width: usedNode.x - rect.x, height: rect.height });
                }
                if (usedNode.x + usedNode.width < rect.x + rect.width) {
                    freeRects.push({
                        x: usedNode.x + usedNode.width,
                        y: rect.y,
                        width: (rect.x + rect.width) - (usedNode.x + usedNode.width),
                        height: rect.height
                    });
                }

                freeRects.splice(i, 1);
                i--;
            }
        }
    }

    private pruneFreeRectangles(freeRects: FreeRectangle[]) {
        for (let i = 0; i < freeRects.length; i++) {
            for (let j = i + 1; j < freeRects.length; j++) {
                if (this.isContained(freeRects[i], freeRects[j])) {
                    freeRects.splice(i, 1);
                    i--;
                    break;
                }
                if (this.isContained(freeRects[j], freeRects[i])) {
                    freeRects.splice(j, 1);
                    j--;
                }
            }
        }
    }

    private isIntersecting(a: FreeRectangle, b: { x: number; y: number; width: number; height: number }): boolean {
        return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
    }

    private isContained(a: FreeRectangle, b: FreeRectangle): boolean {
        return a.x >= b.x && a.y >= b.y && a.x + a.width <= b.x + b.width && a.y + a.height <= b.y + b.height;
    }
}