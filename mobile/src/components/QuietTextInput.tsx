import React, { useState } from 'react';
import { View, TextInput, TextInputProps } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface QuietTextInputProps extends TextInputProps {
  iconName?: keyof typeof Ionicons.glyphMap;
  containerClassName?: string;
}

export default function QuietTextInput({ iconName, containerClassName = '', ...props }: QuietTextInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View 
      className={`flex-row items-center bg-background rounded-lg border p-3 transition-colors ${isFocused ? 'border-primary' : 'border-surface-variant'} ${containerClassName}`}
    >
      {iconName && (
        <Ionicons 
          name={iconName} 
          size={20} 
          color={isFocused ? "#ffffff" : "#8f9194"} 
          className="mr-3" 
        />
      )}
      <TextInput
        className="flex-1 text-on-surface text-base"
        placeholderTextColor="#8f9194"
        selectionColor="#ffffff"
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...props}
      />
    </View>
  );
}