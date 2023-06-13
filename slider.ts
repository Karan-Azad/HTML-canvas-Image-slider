let positionX = 0;
let mouseUpPosition = 0;
let canvasInnerWidth = 0;

// Returns the coordinates the image must be placed
// in to sit at the center of the canvas
function getRelativeCenterCoords(
    canvasWidth : number, canvasHeight : number,
    imageWidth : number, imageHeight : number
) : { x: number, y: number } {

    let coords = { "x": 0, "y": 0 };

    coords.x = (canvasWidth - imageWidth) / 2;
    coords.y = (canvasHeight - imageHeight) / 2;

    return coords;
}

//Promise function to preload images
// in order to draw them in the right order
function preloadImages(urls : any) {
  const promises = urls.map((url : string) => {
    return new Promise((resolve, reject) => {
      const image = new Image();

      image.src = url;

      image.onload = () => resolve(image);
      image.onerror = () => reject(`Image failed to load: ${url}`);
    });
  });

  return Promise.all(promises);
}

// Draws images on the canvas
function drawImages(
    context : any, image : any[],
    canvasWidth : number, canvasHeight : number,
    dx : number
) {
    let pushSize : number = 0;

    //Clear canvas before drawing images
    context?.clearRect(0, 0, canvasWidth, canvasHeight);

    image.map((img) => {
        let imageWidth = img?.naturalWidth;
        let imageHeight = img?.naturalHeight;

        let x = (
            getRelativeCenterCoords(
                canvasWidth, canvasHeight,
                imageWidth, imageHeight
            ).x + (
                pushSize + (dx ? dx : 0)
            )
        );

        let y = (
            getRelativeCenterCoords(
                canvasWidth, canvasHeight,
                imageWidth, imageHeight
            ).y
        );

        //Draw images
        context?.drawImage(img, x, y, imageWidth, imageHeight);

        pushSize += canvasWidth;
    });
}

// Initialises canvas by getting appropriate values
// and fetching loaded images to be passed on as a parameter
async function initialiseCanvas(dx ?: any ) {
    const canvas = (
        document.getElementById("canvas") as
            HTMLCanvasElement | null
    );

    const imageSource = [
        "assets/image-1.png",
        "assets/image-2.png",
        "assets/image-3.png",
        "assets/image-4.png"
    ];

    if (canvas) {
        const context = canvas?.getContext("2d");

        const canvasWidth = canvas ? canvas.width : 0;
        const canvasHeight = canvas ? canvas.height : 0;

        canvas.style.width =  canvasWidth + "px";
        canvas.style.height =  canvasHeight + "px";

        canvasInnerWidth  = canvasWidth * (imageSource.length - 1);

        //Preload images to draw them in the right order
        let image = await preloadImages(imageSource);

        drawImages(context, image, canvasWidth, canvasHeight, dx);
    }
}

// Redraws the canvas when target is clicked and dragged
function onDragEvent() {
    const canvas = document.getElementById("canvas");

    const mouseDownHandler = function (e) {
        if (canvas) {
            canvas.className = "grab-active";

            positionX = mouseUpPosition + e.clientX;
        }

        document.addEventListener('mousemove', mouseMoveHandler);
        document.addEventListener('mouseup', mouseUpHandler);
    };

    const mouseMoveHandler = function (e) {
        // How far the mouse has been moved
        let dx = e.clientX - positionX;

        // Scroll the element
        if (canvas) {
            if (dx > 0 || dx < -(canvasInnerWidth)) {
                document.removeEventListener('mousemove', mouseMoveHandler);
            } else {
                initialiseCanvas(dx);
                mouseUpPosition = -(dx);
            }
        }
    };

    const mouseUpHandler = function () {
        document.removeEventListener('mousemove', mouseMoveHandler);
        document.removeEventListener('mouseup', mouseUpHandler);

        if (canvas) {
            canvas.className = "";
        }
    };

    // Attach the handler
    canvas?.addEventListener('mousedown', mouseDownHandler);

}

window.addEventListener("load", () : void => {
    initialiseCanvas();
    onDragEvent();
});