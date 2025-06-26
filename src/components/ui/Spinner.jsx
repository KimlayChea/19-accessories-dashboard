import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

function Spinner({ height = "95vh" }) {
  return (
    <div
      className="flex items-center justify-center"
      style={{ height: height }}
    >
      <Box>
        <CircularProgress
          size="3rem"
          sx={{
            color: "var(--foreground)", // change stroke color
          }}
        />
      </Box>
    </div>
  );
}

export default Spinner;
