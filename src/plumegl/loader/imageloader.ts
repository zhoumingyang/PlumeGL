export class ImageLoader {

    static load(url: string, onLoad?: Function, onError?: Function) {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = url;
        img.onload = function () {
            if (onLoad) {
                try {
                    onLoad(img);
                } catch (e) {
                    if (onError) {
                        onError(e);
                        console.warn(`load image error: ${url}`);
                    }
                    console.error(e);
                }
            }
        };
        return img;
    }
}