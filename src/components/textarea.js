"use client";
import { useLayoutEffect, useRef } from 'react';
export default function Textarea({ onChange, className = '', ...props }) {
  const ref = useRef(null);
  const resize = element => { element.style.height = 'auto'; element.style.height = `${element.scrollHeight}px`; };
  useLayoutEffect(() => { if (ref.current) resize(ref.current); }, []);
  return <textarea className={`resize-none ${className}`} {...props} ref={ref} onChange={event => { resize(event.currentTarget); onChange?.(event); }} />;
}
