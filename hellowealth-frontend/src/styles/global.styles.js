import styled, { createGlobalStyle } from 'styled-components'
import tw from 'tailwind.macro'

export const GlobalStyle = createGlobalStyle`
 * {
    box-sizing: border-box;
  }
  html {
    height: 100%;
    scroll-behavior: smooth;
  }

  body {
    height: 100%;
    ${tw`font-body`}
  }

  #root {
    height: 100%;
  }
`

export const HomeMenu = styled.ul`
  ${tw`flex justify-end font-display flex-col text-2xl lg:flex-row`}

  & > li {
    ${tw`mx-1 px-2`}
  }
`

export const PageLayout = styled.div`
  ${tw`flex flex-col bg-pink h-full lg:flex-row`}
`

export const PageLeftCol = styled.div`
  ${tw`flex flex-row justify-center items-center bg-blue lg:flex-col`}
`

export const PageRightCol = styled.div`
  ${tw`flex flex-col w-full p-4`}
`

export const SpinnerWrap = styled.div`
  ${tw`flex justify-center w-full mt-16`};
`

export const Spinner = styled.div`
  ${tw`rounded-full border-8 border-t-8 border-gray-200 h-16 w-16 m-5`}
  border-top-color: #030730;
  -webkit-animation: spinner 1.5s linear infinite;
  animation: spinner 1.5s linear infinite;
  @-webkit-keyframes spinner {
    0% {
      -webkit-transform: rotate(0deg);
    }
    100% {
      -webkit-transform: rotate(360deg);
    }
  }

  @keyframes spinner {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`

export const ErrorMsg = styled.div`
  ${tw`text-red font-display`}
`

export const FormGroup = styled.div`
  ${tw`flex flex-col p-2`}
`

export const FormInput = styled.input`
  ${tw`h-10`}
  border: 2px solid rgba(114, 121, 140, 0.8);

  ::placeholder {
    ${tw`text-gray`}
  }
`
