interface OrbProps {
  style: React.CSSProperties;
}

const AmbientOrbs = ({ style }: OrbProps) => {
  return (
    <>
      <div
        style={{
          position: "absolute",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(124,58,237,0.18) 0%, rgba(99,102,241,0.08) 50%, transparent 70%)",
          pointerEvents: "none",
          filter: "blur(1px)",
          ...style,
        }}
      />
    </>
  );
};
export default AmbientOrbs;
