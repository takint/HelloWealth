import styled, { createGlobalStyle, css } from 'styled-components'
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
    ${tw`font-body bg-pink`}
  }
`

export const colors = {
  primary: '#030730',
  white: '#FFF',
  black: '#000',
  gray: '#eeeeee',
  grey: '#343740',
  greyMedium: '#444444',
  greyMediumOpacity: (opacity) => `rgba(114, 121, 140, ${opacity || '1'})`,
}

export const FONT_FAMILIES = {
  display: 'Belleza, sans-serif',
  body: 'Noto+Sans, sans-serif',
}

export const FONT_WEIGHTS = {
  regular: 300,
  medium: 500,
  bold: 700,
}

export const HomeMenu = styled.ul`
  ${tw`flex justify-end font-display flex-col text-2xl lg:flex-row`}

  & > li {
    ${tw`mx-1 px-2`}
  }
`

export const UserMenu = styled.div`
  ${tw`flex flex-col items-center justify-around p-2 bg-blue text-white lg:flex-row lg:p-4 `}
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

export const WatchListButton = styled.button`
  ${tw`bg-blue rounded p-2 text-white font-display`}
  height: 45px;
  width: 200px;
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

export const InfoTitle = styled.h3`
  ${tw`text-lg font-display font-bold p-2 mt-2`}
`

export const InfoBox = styled.div`
  ${tw`bg-white rounded-lg p-4`}
`

export const Spacer = styled.div`
  ${props => props.height && css`height: ${props.height}`}
`

export const ReactSelectStyles = {
  container: (styles, state) => ({
    ...styles,
    zIndex: state.selectProps.menuIsOpen ? 9999 : 'unset',
  }),

  valueContainer: (styles) => ({
    ...styles,
    '@media (max-width: 768px)': {
      '.more-info': {
        display: 'none',
      },
    },
  }),
  control: (styles, state) => ({
    ...styles,
    color: 'rgba(114, 121, 140, .6)',
    minHeight: '3rem',
    // Make the same with bootstrap select style
    border:
      state.selectProps.className === 'invalid'
        ? '2px solid #dc3545 !important'
        : state.isFocused
        ? '2px solid #80bdff'
        : '2px solid rgba(114 , 121, 140, .2)',
    boxShadow:
      state.isFocused && state.selectProps.className === 'invalid'
        ? '0 0 0 0.2rem rgba(220, 53, 69, 0.2)'
        : state.isFocused
        ? '0 0 0 0.2rem rgba(0, 123, 255, 0.25)'
        : 'none',
    '&:hover': {
      border: state.isFocused
        ? '2px solid #80bdff'
        : '2px solid rgba(114 , 121, 140, .2)',
    },
  }),
  dropdownIndicator: (styles) => ({
    ...styles,
    padding: 12,
    color: colors.primary,
    '> svg': {
      fill: colors.primary,
    },
  }),
  clearIndicator: () => ({}),
  indicatorSeparator: (styles) => ({
    ...styles,
    display: 'none',
  }),
  singleValue: (styles) => ({
    ...styles,
    color: colors.grey,
  }),
  multiValue: (styles) => ({
    ...styles,
    backgroundColor: colors.primary,
    padding: 0,
    color: colors.white,
  }),
  multiValueLabel: (styles, { data }) => ({
    ...styles,
    color: data.color,
    fontFamily: FONT_FAMILIES.display,
    fontWeight: FONT_WEIGHTS.medium,
  }),
  multiValueRemove: (styles, { data }) => ({
    ...styles,
    color: data.color,
    backgroundColor: colors.primary,
    cursor: 'pointer',
    ':hover': {
      backgroundColor: data.color,
      color: data.color,
    },
  }),
  input: (styles) => ({
    ...styles,
    padding: 0,
    color: colors.greyMedium,
    fontFamily: FONT_FAMILIES.display,
    fontWeight: FONT_WEIGHTS.medium,
    fontStyle: 'normal',
    height: '100%',
    lineHeight: '100%',
    marginTop: 0,
    marginBottom: 0,
    '@media (max-width: 767px)': {
      fontSize: '1rem',
    },
  }),
  menuList: (styles) => ({
    ...styles,
    textAlign: 'left',
    color: colors.grey,
  }),
  placeholder: (styles) => ({
    ...styles,
    padding: 0,
    color: colors.greyMediumOpacity('0.6'),
    fontFamily: FONT_FAMILIES.display,
    fontWeight: FONT_WEIGHTS.medium,
    '> svg': {
      color: colors.primary,
      paddingTop: '0.2rem',
      marginRight: '0.5rem',
    },
    '@media (max-width: 767px)': {
      fontSize: '1rem',
      lineHeight: 1.3,
    },
  }),
}
