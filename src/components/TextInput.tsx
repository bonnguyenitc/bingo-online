import React from 'react'
import { Input, InputProps } from '@chakra-ui/react'
import { Control, Controller } from 'react-hook-form'

type Props = {
  control: Control
  name: string
}

export default function TextInput({ control, name, ...props }: Props & InputProps) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onBlur, onChange } }) => (
        <Input
          onChange={onChange}
          onBlur={onBlur}
          color="text"
          borderColor="main.3"
          focusBorderColor="main.3"
          {...props}
        />
      )}
    />
  )
}
