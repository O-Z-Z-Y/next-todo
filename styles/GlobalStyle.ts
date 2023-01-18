import { createGlobalStyle, css } from "styled-components";
import reset from "styled-reset";

const globalStyle = css`
  ${reset}
  * {
    box-sizing: border-box;
  }
  body {
    font-family: Noto sans-serif, Noto Sans KR;
  }
`;

const GlobalStyle = createGlobalStyle`
  ${globalStyle}
`

export default GlobalStyle;