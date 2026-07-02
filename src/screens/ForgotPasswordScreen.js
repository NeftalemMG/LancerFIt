import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, radius, shadow } from '../theme/tokens';
import { disp, body } from '../theme/typography';
import { Card, PressScale } from '../components/ui';
import { ArrowRight } from '../components/icons';
import AuthHeader from '../components/auth/AuthHeader';
import AuthField from '../components/auth/AuthField';
import { requestPasswordReset } from '../services/authApi';
import { validateForgotPassword } from '../utils/authValidation';

export default function ForgotPasswordScreen({ goToSignIn }) {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    if (submitting) return;

    const result = validateForgotPassword({ email });
    setErrors(result.errors);
    setSubmitError('');
    setSuccessMessage('');

    if (!result.valid) {
      return;
    }

    setSubmitting(true);
    try {
      const response = await requestPasswordReset(result.values);
      setSuccessMessage(response?.message || 'If an account exists for that email, a reset link has been sent.');
    } catch (error) {
      setSubmitError(error?.message || 'Unable to request a password reset right now.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.root}>
      <AuthHeader
        title="Forgot Password"
        subtitle="Enter your email address and we’ll send a reset link if the account exists."
        note="Password recovery"
      />

      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <Card style={styles.formCard}>
          <AuthField
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="name@uwindsor.ca"
            textContentType="emailAddress"
            keyboardType="email-address"
            autoComplete="email"
            returnKeyType="go"
            onSubmitEditing={submit}
            error={errors.email}
          />

          {submitError ? <Text style={styles.submitError}>{submitError}</Text> : null}
          {successMessage ? <Text style={styles.successMessage}>{successMessage}</Text> : null}

          <PressScale onPress={submit} scaleTo={0.98} disabled={submitting} style={styles.submitWrap}>
            <LinearGradient colors={[colors.blue2, colors.blue]} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={[styles.submitBtn, submitting && styles.submitBtnDisabled]}>
              <Text style={styles.submitText}>{submitting ? 'Sending…' : 'Send Reset Link'}</Text>
              <ArrowRight size={17} color="#fff" strokeWidth={2.4} />
            </LinearGradient>
          </PressScale>
        </Card>

        <View style={styles.footerRow}>
          <Text style={styles.footerText}>Remembered it?</Text>
          <PressScale onPress={goToSignIn} disabled={submitting}>
            <Text style={styles.footerLink}>Back to Sign In</Text>
          </PressScale>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.appBg },
  body: {
    paddingHorizontal: 22,
    paddingTop: 24,
    paddingBottom: 40,
  },
  formCard: {
    paddingHorizontal: 16,
    paddingVertical: 18,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.cardLine2,
    ...shadow.card,
  },
  submitWrap: {
    marginTop: 2,
  },
  submitBtn: {
    height: 56,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
    ...shadow.accent('rgba(47,123,196,0.8)'),
  },
  submitBtnDisabled: {
    opacity: 0.86,
  },
  submitText: {
    fontFamily: disp.bold,
    fontSize: 15.5,
    color: '#fff',
  },
  submitError: {
    marginTop: 2,
    marginBottom: 10,
    fontFamily: body.medium,
    fontSize: 12.5,
    lineHeight: 18,
    color: colors.gold,
  },
  successMessage: {
    marginTop: 2,
    marginBottom: 10,
    fontFamily: body.medium,
    fontSize: 12.5,
    lineHeight: 18,
    color: colors.green,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 18,
  },
  footerText: {
    fontFamily: body.regular,
    fontSize: 13,
    color: colors.text2,
  },
  footerLink: {
    fontFamily: disp.bold,
    fontSize: 13,
    color: colors.gold,
  },
});