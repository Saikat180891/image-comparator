import { forwardRef, useCallback, useEffect, useRef, useState } from "react";
import "./styles.css";

const HandleBar = forwardRef((props, ref) => {
  return (
    <div className="handlebar">
      <div ref={ref} className="handleHolder"></div>
    </div>
  );
});

const Layer = ({ handleBar, src = "", offset = 0 }) => {
  return (
    <div
      className="image-container"
      style={{ transform: `translateX(${offset}px)` }}
    >
      <img src={src} className="image" alt="image-layer" />
      {handleBar}
    </div>
  );
};

const useImageComparatorHandle = (start = 0, end = 0) => {
  const ref = useRef();
  const [x, setX] = useState(start);

  const [isMouseDown, setIsMouseDown] = useState(false);

  const handleMouseDown = useCallback(
    (e) => {
      if (!ref.current.contains(e.target)) return;
      setIsMouseDown((prev) => true);
    },
    [setIsMouseDown, ref]
  );

  const handleMouseUp = useCallback(
    (e) => {
      setIsMouseDown((prev) => false);
    },
    [setIsMouseDown]
  );

  const handleMouseMove = useCallback(
    (e) => {
      if (isMouseDown && e.x > start && e.x < end) {
        setX(e.x);
      }
    },
    [isMouseDown, start, end]
  );

  useEffect(() => {
    if (!ref.current) return;

    const listeners = {
      mousedown: handleMouseDown,
      mousemove: handleMouseMove,
      mouseup: handleMouseUp
    };

    Object.entries(listeners).forEach(([event, handler]) =>
      document.addEventListener(event, handler)
    );

    return () => {
      Object.entries(listeners).forEach(([event, handler]) =>
        document.removeEventListener(event, handler)
      );
    };
  }, [
    ref,
    isMouseDown,
    setIsMouseDown,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp
  ]);

  return [ref, x];
};

const ImageComparator = () => {
  const [image2Ref, x2] = useImageComparatorHandle(50, 500);
  const [image3Ref, x3] = useImageComparatorHandle(100, 500);

  return (
    <div className="wrapper">
      <Layer src="https://images.unsplash.com/photo-1664575196412-ed801e8333a1?ixlib=rb-1.2.1&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2071&q=80" />
      <Layer
        offset={x2}
        handleBar={<HandleBar ref={image2Ref} />}
        src="https://images.unsplash.com/photo-1665502252515-8380abd497fe?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2428&q=80"
      />
      <Layer
        offset={x3}
        handleBar={<HandleBar ref={image3Ref} />}
        src="https://images.unsplash.com/photo-1665507254439-fe45f1417c13?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"
      />
    </div>
  );
};

export default function App() {
  return (
    <div style={{ width: "500px", height: "300px" }}>
      <ImageComparator />
    </div>
  );
}
