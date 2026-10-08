function SegmentedRowChart({ data, height = 30 }) {
  const total = data.reduce((sum, item) => sum + item.count, 0);

  if (total === 0) {
    return (
      <div
        style={{
          width: "100%",
          height: `${height}px`,
          backgroundColor: "#eee",
        }}
      />
    );
  }

  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        minWidth: 0,
        height: `${height}px`,
        overflow: "hidden",
        borderRadius: "6px",
      }}
    >
      {data.map((item) => {
        const percentage = (item.count / total) * 100;

        return (
          <div
            key={item.name}
            style={{
              width: `${percentage}%`,
              minWidth: 0,
              flexShrink: 0,
              backgroundColor: item.colourCode,
            }}
            title={`${item.name}: ${item.count}`}
          />
        );
      })}
    </div>
  );
}

export default SegmentedRowChart;
