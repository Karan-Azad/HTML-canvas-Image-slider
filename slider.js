var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var positionX = 0;
var mouseUpPosition = 0;
var canvasInnerWidth = 0;
// Returns the coordinates the image must be placed
// in to sit at the center of the canvas
function getRelativeCenterCoords(canvasWidth, canvasHeight, imageWidth, imageHeight) {
    var coords = { "x": 0, "y": 0 };
    coords.x = (canvasWidth - imageWidth) / 2;
    coords.y = (canvasHeight - imageHeight) / 2;
    return coords;
}
//Promise function to preload images
// in order to draw them in the right order
function preloadImages(urls) {
    var promises = urls.map(function (url) {
        return new Promise(function (resolve, reject) {
            var image = new Image();
            image.src = url;
            image.onload = function () { return resolve(image); };
            image.onerror = function () { return reject("Image failed to load: ".concat(url)); };
        });
    });
    return Promise.all(promises);
}
// Draws images on the canvas
function drawImages(context, image, canvasWidth, canvasHeight, dx) {
    var pushSize = 0;
    //Clear canvas before drawing images
    context === null || context === void 0 ? void 0 : context.clearRect(0, 0, canvasWidth, canvasHeight);
    image.map(function (img) {
        var imageWidth = img === null || img === void 0 ? void 0 : img.naturalWidth;
        var imageHeight = img === null || img === void 0 ? void 0 : img.naturalHeight;
        var x = (getRelativeCenterCoords(canvasWidth, canvasHeight, imageWidth, imageHeight).x + (pushSize + (dx ? dx : 0)));
        var y = (getRelativeCenterCoords(canvasWidth, canvasHeight, imageWidth, imageHeight).y);
        //Draw images
        context === null || context === void 0 ? void 0 : context.drawImage(img, x, y, imageWidth, imageHeight);
        pushSize += canvasWidth;
    });
}
// Initialises canvas by getting appropriate values
// and fetching loaded images to be passed on as a parameter
function initialiseCanvas(dx) {
    return __awaiter(this, void 0, void 0, function () {
        var canvas, imageSource, context, canvasWidth, canvasHeight, image;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    canvas = document.getElementById("canvas");
                    imageSource = [
                        "assets/image-1.png",
                        "assets/image-2.png",
                        "assets/image-3.png",
                        "assets/image-4.png"
                    ];
                    if (!canvas) return [3 /*break*/, 2];
                    context = canvas === null || canvas === void 0 ? void 0 : canvas.getContext("2d");
                    canvasWidth = canvas ? canvas.width : 0;
                    canvasHeight = canvas ? canvas.height : 0;
                    canvas.style.width = canvasWidth + "px";
                    canvas.style.height = canvasHeight + "px";
                    canvasInnerWidth = canvasWidth * (imageSource.length - 1);
                    return [4 /*yield*/, preloadImages(imageSource)];
                case 1:
                    image = _a.sent();
                    drawImages(context, image, canvasWidth, canvasHeight, dx);
                    _a.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    });
}
// Redraws the canvas when target is clicked and dragged
function onDragEvent() {
    var canvas = document.getElementById("canvas");
    var mouseDownHandler = function (e) {
        console.log("hello");
        if (canvas) {
            canvas.style.cursor = 'grabbing';
            canvas.style.userSelect = 'none';
            positionX = mouseUpPosition + e.clientX;
        }
        document.addEventListener('mousemove', mouseMoveHandler);
        document.addEventListener('mouseup', mouseUpHandler);
    };
    var mouseMoveHandler = function (e) {
        // How far the mouse has been moved
        var dx = e.clientX - positionX;
        // Scroll the element
        if (canvas) {
            if (dx > 0 || dx < -(canvasInnerWidth)) {
                document.removeEventListener('mousemove', mouseMoveHandler);
            }
            else {
                initialiseCanvas(dx);
                mouseUpPosition = -(dx);
            }
        }
    };
    var mouseUpHandler = function () {
        document.removeEventListener('mousemove', mouseMoveHandler);
        document.removeEventListener('mouseup', mouseUpHandler);
        if (canvas) {
            canvas.style.cursor = 'grab';
            canvas.style.removeProperty('user-select');
        }
    };
    // Attach the handler
    canvas === null || canvas === void 0 ? void 0 : canvas.addEventListener('mousedown', mouseDownHandler);
}
window.addEventListener("load", function () {
    initialiseCanvas();
    onDragEvent();
});
