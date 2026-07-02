import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { colors } from '../../theme/tokens';
import { disp, body } from '../../theme/typography';

export default function AuthField({
  label,
  value,
  onChangeText,
  placeholder,
  inputRef,
  autoCapitalize = 'none',
  textContentType,
  keyboardType,
  secureTextEntry,
  autoComplete,
  returnKeyType,
  onSubmitEditing,
  error,
}) {
  return (
    <View style={styles.block}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.box, error && styles.boxError]}>
        <TextInput
          ref={inputRef}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.text3}
          style={styles.input}
          autoCapitalize={autoCapitalize}
          autoCorrect={false}
          textContentType={textContentType}
          keyboardType={keyboardType}
          secureTextEntry={secureTextEntry}
          autoComplete={autoComplete}
          returnKeyType={returnKeyType}
          onSubmitEditing={onSubmitEditing}
        />
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    marginBottom: 14,
  },
  label: {
    marginBottom: 8,
    fontFamily: body.semibold,
    fontSize: 11,
    letterSpacing: 1.3,
    color: colors.text3,
    textTransform: 'uppercase',
  },
  box: {
    height: 54,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.cardLine,
    backgroundColor: colors.card,
    justifyContent: 'center',
  },
  boxError: {
    borderColor: 'rgba(224,168,56,0.75)',
  },
  input: {
    padding: 0,
    fontFamily: disp.semibold,
    fontSize: 16,
    color: colors.text,
    letterSpacing: -0.2,
  },
  error: {
    marginTop: 7,
    fontFamily: body.medium,
    fontSize: 11.5,
    lineHeight: 16,
    color: colors.gold,
  },
});
