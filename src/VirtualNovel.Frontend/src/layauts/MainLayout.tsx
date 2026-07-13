import {Box, Stack} from "@mui/material";
import NavBar from "./NavBar.tsx";
import Logo from "./Logo.tsx";
import {Outlet} from "react-router-dom";
import Footers from "./Footers.tsx";

function MainLayout() {

  return (
      <Box
          sx={{
              width: "100%",
              maxWidth: 1400,
              mx: "auto",
              px: { xs: 1.5, sm: 2, md: 3 },
              pt: { xs: 1.5, md: 4 },
              pb: 4,
          }}
      >
          <Stack>
              <NavBar />
              <Logo />

              <Box component="main" sx={{ minWidth: 0 }}>
                  <Outlet />
              </Box>

              <Footers />
          </Stack>
      </Box>
  )
}

export default MainLayout
