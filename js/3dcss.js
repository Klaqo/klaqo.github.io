/**
 * Based on http://www.emagix.net/academic/mscs-project/item/camera-sync-with-css3-and-webgl-threejs
 * @author mrdoob / http://mrdoob.com/
 *
 */

THREE.CSS3DObject = function (element) {
    THREE.Object3D.call(this);
  
    this.element = element;
    this.element.style.position = 'absolute';
  
    this.addEventListener('removed', function () {
      if (this.element.parentNode !== null) {
        this.element.parentNode.removeChild(this.element);
      }
  
    });
  
  };
  
  THREE.CSS3DObject.prototype = Object.create(THREE.Object3D.prototype);
  
  THREE.CSS3DSprite = function (element) {
    THREE.CSS3DObject.call(this, element);
  };
  
  THREE.CSS3DSprite.prototype = Object.create(THREE.CSS3DObject.prototype);
  //
  THREE.CSS3DRenderer = function () {
    console.log('THREE.CSS3DRenderer', THREE.REVISION);
  
    var _width, _height;
    var _widthHalf, _heightHalf;
  
    var matrix = new THREE.Matrix4();
  
    var cache = {
      camera: {
        fov: 0,
        style: ''
      },
      objects: {}
    };
  
    var domElement = document.createElement('div');
    domElement.style.overflow = 'hidden';
    domElement.style.WebkitTransformStyle =
        domElement.style.MozTransformStyle =
            domElement.style.oTransformStyle =
                domElement.style.transformStyle = 'preserve-3d';
    this.domElement = domElement;
  
    var cameraElement = document.createElement('div');
  
    cameraElement.style.WebkitTransformStyle =
        cameraElement.style.MozTransformStyle =
            cameraElement.style.oTransformStyle =
                cameraElement.style.transformStyle = 'preserve-3d';
  
    domElement.appendChild(cameraElement);
  
    this.setClearColor = function () {
  
    };
  
    this.setSize = function (width, height) {
      _width = width;
      _height = height;
  
      _widthHalf = _width / 2;
      _heightHalf = _height / 2;
  
      domElement.style.width = width + 'px';
      domElement.style.height = height + 'px';
  
      cameraElement.style.width = width + 'px';
      cameraElement.style.height = height + 'px';
  
    };
  
    var epsilon = function (value) {
      return Math.abs(value) < 0.000001 ? 0 : value;
    };
  
    var getCameraCSSMatrix = function (matrix) {
      return 'matrix3d(' + matrix.elements.map(function (e) {
        return epsilon(e % 4 == 1 ? -e : e);
      }).join(',') + ')';
    };
  
    var getObjectCSSMatrix = function (matrix) {
      return 'translate3d(-50%,-50%,0) matrix3d(' + matrix.elements.map(function (e) {
        return epsilon(e > 3 && e < 8 ? -e : e);
      }).join(',') + ')';
    };
  
    var renderObject = function (object, camera) {
      if (object instanceof THREE.CSS3DObject) {
        var style;
  
        if (object instanceof THREE.CSS3DSprite) {
          // http://swiftcoder.wordpress.com/2008/11/25/constructing-a-billboard-matrix/
          matrix.copy(camera.matrixWorldInverse);
          matrix.transpose();
          matrix.copyPosition(object.matrixWorld);
          matrix.scale(object.scale);
  
          matrix.elements[3] = 0;
          matrix.elements[7] = 0;
          matrix.elements[11] = 0;
          matrix.elements[15] = 1;
  
          style = getObjectCSSMatrix(matrix);
        } else {
          style = getObjectCSSMatrix(object.matrixWorld);
        }
  
        var element = object.element;
        var cachedStyle = cache.objects[object.id];
  
        if (cachedStyle === undefined || cachedStyle !== style) {
          element.style.WebkitTransform = style;
          element.style.MozTransform = style;
          element.style.oTransform = style;
          element.style.transform = style;
  
          cache.objects[object.id] = style;
        }
  
        if (element.parentNode !== cameraElement) {
          cameraElement.appendChild(element);
        }
  
      }
  
      for (var i = 0, l = object.children.length; i < l; i++) {
        renderObject(object.children[i], camera);
      }
  
    };
  
    this.render = function (scene, camera) {
      var fov = 0.5 / Math.tan(THREE.Math.degToRad(camera.fov * 0.5)) * _height;
      if (cache.camera.fov !== fov) {
        domElement.style.WebkitPerspective =
            domElement.style.MozPerspective =
                domElement.style.oPerspective =
                    domElement.style.perspective = fov + "px";
  
        cache.camera.fov = fov;
      }
  
      scene.updateMatrixWorld();
  
      if (camera.parent === undefined) camera.updateMatrixWorld();
      camera.matrixWorldInverse.getInverse(camera.matrixWorld);
  
      var style = "translate3d(0,0," + fov + "px)" + getCameraCSSMatrix(camera.matrixWorldInverse) +
        " translate3d(" + _widthHalf + "px," + _heightHalf + "px, 0)";
  
      if (cache.camera.style !== style) {
        cameraElement.style.WebkitTransform =
            cameraElement.style.MozTransform =
                cameraElement.style.oTransform =
                    cameraElement.style.transform = style;
  
        cache.camera.style = style;
      }
  
      renderObject(scene, camera);
    };
  };