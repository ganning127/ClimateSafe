// pages/_app.js
import { ChakraProvider } from "@chakra-ui/react";
import { extendTheme } from "@chakra-ui/react";
import { Global, css } from "@emotion/react";

import "@fontsource/montserrat/100.css";
import "@fontsource/montserrat/200.css";
import "@fontsource/montserrat/300.css";
import "@fontsource/montserrat/400.css";
import "@fontsource/montserrat/500.css";
import "@fontsource/montserrat/600.css";
import "@fontsource/montserrat/700.css";
import "@fontsource/montserrat/800.css";
import "@fontsource/montserrat/900.css";

const theme = extendTheme({
  colors: {
    lightgreen: "#C7F9CC",
    medgreen: "#80ED99",
    darkgreen: "#57CC99",
    lightblue: "#38A3A5",
    darkblue: "#22577A",
    text: "#30343F",
  },
  fonts: {
    heading: "Montserrat",
    body: "Montserrat",
  },
});

const GlobalStyle = ({ children }) => {
  return (
    <>
      <Global
        styles={css`
          html {
            min-width: 356px;
            scroll-behavior: smooth;
          }
          #__next {
            display: flex;
            flex-direction: column;
            min-height: 100vh;
            background-color: #ffffff;
          }
        `}
      />
      {children}
    </>
  );
};

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider theme={theme}>
      <GlobalStyle>
        <Component {...pageProps} />
      </GlobalStyle>
    </ChakraProvider>
  );
}

export default MyApp;
