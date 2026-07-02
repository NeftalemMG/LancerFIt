import React, { useRef, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, radius, shadow } from '../theme/tokens';
import { disp, body } from '../theme/typography';
import { Card, PressScale } from '../components/ui';
import { ArrowRight } from '../components/icons';
import AuthHeader from '../components/auth/AuthHeader';
import AuthField from '../components/auth/AuthField';
import AuthSelect from '../components/auth/AuthSelect';
import { FACULTY_OPTIONS, NATIONALITY_OPTIONS } from '../data/authOptions';
import { registerUser } from '../services/authApi';
import { validateSignUp } from '../utils/authValidation';

function LoadingLabel({ submitting }) {
  return <Text style={styles.submitText}>{submitting ? 'Creating Account…' : 'Sign Up'}</Text>;
}

export default function SignUpScreen({ onSignUpSuccess, goToSignIn }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [faculty, setFaculty] = useState('');
  const [nationality, setNationality] = useState('');
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const lastNameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);

  const submit = async () => {
    if (submitting) return;

    const result = validateSignUp({ firstName, lastName, email, password, confirmPassword, faculty, nationality });
    setErrors(result.errors);
    setSubmitError('');

    if (!result.valid) {
      return;
    }

    setSubmitting(true);
    try {
      const response = await registerUser(result.values);
      onSignUpSuccess?.(response);
    } catch (error) {
      if (error?.status === 409) {
        setSubmitError('That email is already registered.');
      } else if (error?.status === 400 && Array.isArray(error.errors) && error.errors.length > 0) {
        const nextErrors = {};
        error.errors.forEach((item) => {
          if (item?.field) {
            nextErrors[item.field] = item.message;
          }
        });
        setErrors(nextErrors);
        setSubmitError(error.message || 'Please check the form and try again.');
      } else {
        setSubmitError(error?.message || 'Unable to create your account right now.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.root}>
      <AuthHeader
        title="Sign Up"
        subtitle="Create your LancerFit account to get started."
        note="University of Windsor registration"
      />

      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <Card style={styles.formCard}>
          <View style={styles.nameRow}>
            <View style={styles.nameCol}>
              <AuthField
                label="First Name"
                value={firstName}
                onChangeText={setFirstName}
                placeholder="First name"
                textContentType="givenName"
                autoComplete="name-given"
                autoCapitalize="words"
                returnKeyType="next"
                onSubmitEditing={() => lastNameRef.current?.focus()}
                error={errors.firstName}
              />
            </View>

            <View style={styles.nameCol}>
              <AuthField
                label="Last Name"
                value={lastName}
                onChangeText={setLastName}
                placeholder="Last name"
                inputRef={lastNameRef}
                textContentType="familyName"
                autoComplete="name-family"
                autoCapitalize="words"
                returnKeyType="next"
                onSubmitEditing={() => emailRef.current?.focus()}
                error={errors.lastName}
              />
            </View>
          </View>

          <AuthField
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="name@uwindsor.ca"
            inputRef={emailRef}
            textContentType="emailAddress"
            keyboardType="email-address"
            autoComplete="email"
            returnKeyType="next"
            onSubmitEditing={() => passwordRef.current?.focus()}
            error={errors.email}
          />

          <View style={styles.nameRow}>
            <View style={styles.nameCol}>
              <AuthField
                label="Password"
                value={password}
                onChangeText={setPassword}
                placeholder="Create a password"
                inputRef={passwordRef}
                textContentType="newPassword"
                secureTextEntry
                autoComplete="new-password"
                returnKeyType="next"
                onSubmitEditing={() => confirmPasswordRef.current?.focus()}
                error={errors.password}
              />
            </View>

            <View style={styles.nameCol}>
              <AuthField
                label="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Re-enter password"
                inputRef={confirmPasswordRef}
                textContentType="newPassword"
                secureTextEntry
                autoComplete="new-password"
                returnKeyType="next"
                onSubmitEditing={submit}
                error={errors.confirmPassword}
              />
            </View>
          </View>

          <AuthSelect
            label="Faculty"
            value={faculty}
            options={FACULTY_OPTIONS}
            placeholder="Select your faculty"
            searchPlaceholder="Search faculties"
            onChange={setFaculty}
            error={errors.faculty}
          />

          <AuthSelect
            label="Nationality"
            value={nationality}
            options={NATIONALITY_OPTIONS}
            placeholder="Select your nationality"
            searchPlaceholder="Search nationality"
            onChange={setNationality}
            error={errors.nationality}
          />

          {submitError ? <Text style={styles.submitError}>{submitError}</Text> : null}

          <PressScale onPress={submit} scaleTo={0.98} disabled={submitting} style={styles.submitWrap}>
            <LinearGradient colors={[colors.blue2, colors.blue]} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={[styles.submitBtn, submitting && styles.submitBtnDisabled]}>
              <LoadingLabel submitting={submitting} />
              <ArrowRight size={17} color="#fff" strokeWidth={2.4} />
            </LinearGradient>
          </PressScale>
        </Card>

        <View style={styles.footerRow}>
          <Text style={styles.footerText}>Already have an account?</Text>
          <PressScale onPress={goToSignIn} disabled={submitting}>
            <Text style={styles.footerLink}>Sign In</Text>
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
  nameRow: {
    flexDirection: 'row',
    gap: 10,
  },
  nameCol: {
    flex: 1,
    minWidth: 0,
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
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 18,
    flexWrap: 'wrap',
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
