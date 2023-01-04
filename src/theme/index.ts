import { extendTheme } from '@chakra-ui/react'

const config = {
  initialColorMode: 'light',
  useSystemColorMode: false,
}

const colors = {
  main: {
    1: '#222831',
    2: '#393E46',
    3: '#393E46',
    4: '#EEEEEE',
  },
  background: '#EEEEEE',
  text: '#222831',
  textLight: '#FFFFFF',
}

const breakpoints = {
  sm: '320px',
  md: '768px',
}

const fontSizes = {
  lg: '18px',
}

const layerStyles = {
  base: {
    bg: 'gray.50',
    border: '2px solid',
    borderColor: 'gray.500',
  },
  selected: {
    bg: 'teal.500',
    color: 'teal.700',
    borderColor: 'orange.500',
  },
}

const textStyles = {
  h1: {
    fontSize: ['48px', '72px'],
    fontWeight: 'bold',
    lineHeight: '110%',
    letterSpacing: '-2%',
  },
  h2: {
    fontSize: ['36px', '48px'],
    fontWeight: 'semibold',
    lineHeight: '110%',
    letterSpacing: '-1%',
  },
}

export const theme = extendTheme({
  config,
  colors,
  fontSizes,
  breakpoints,
  layerStyles,
  textStyles,
})
