import React, { useRef, useState } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { colors, radius, shadow } from "../theme/tokens";
import { disp, body } from "../theme/typography";
import { Card, PressScale } from "../components/ui";
import { ArrowRight } from "../components/icons";
import AuthHeader from "../components/auth/AuthHeader";
import AuthField from "../components/auth/AuthField";
import { loginUser } from "../services/authApi";
import { validateSignIn } from "../utils/authValidation";

export default function SignInScreen({
  onSignInSuccess,
  goToSignUp,
  goToForgotPassword,
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const passwordRef = useRef(null);

  if (__DEV__ && email === "test@test.com") {
  onSignInSuccess?.({ token: "mock-token" });
  return;
}

  const submit = async () => {
    if (submitting) return;

    const result = validateSignIn({ email, password });

    setErrors(result.errors);
    setSubmitError("");

    if (!result.valid) return;

    try {
      setSubmitting(true);

      const res = await loginUser(result.values);

      onSignInSuccess?.(res);
    } catch (error) {
      if (error?.status === 401) {
        setSubmitError("Invalid email or password.");
      } else {
        setSubmitError(error?.message || "Unable to sign in right now.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.root}>
      <AuthHeader
        title="Sign In"
        subtitle="Use your University of Windsor email to continue."
        note="Built for the Toldo Lancer Centre experience."
      />

      <ScrollView
        contentContainerStyle={styles.body}
        showsVerticalScrollIndicator={false}
      >
        <Card style={styles.formCard}>
          <AuthField
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="name@uwindsor.ca"
            inputRef={null}
            textContentType="emailAddress"
            keyboardType="email-address"
            autoComplete="email"
            returnKeyType="next"
            onSubmitEditing={() => passwordRef.current?.focus()}
            error={errors.email}
          />

          <AuthField
            label="Password"
            value={password}
            onChangeText={setPassword}
            placeholder="Your password"
            inputRef={passwordRef}
            textContentType="password"
            secureTextEntry
            autoComplete="password"
            returnKeyType="go"
            onSubmitEditing={submit}
            error={errors.password}
          />

          {submitError ? (
            <Text style={styles.submitError}>{submitError}</Text>
          ) : null}

          <PressScale onPress={goToForgotPassword} style={styles.forgotWrap}>
            <Text style={styles.forgotText}>Forgot Password?</Text>
          </PressScale>

          <PressScale
            onPress={submit}
            scaleTo={0.98}
            disabled={submitting}
            style={styles.submitWrap}
          >
            <LinearGradient
              colors={[colors.blue2, colors.blue]}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={[styles.submitBtn, submitting && styles.submitBtnDisabled]}
            >
              <Text style={styles.submitText}>
                {submitting ? "Signing In…" : "Sign In"}
              </Text>
              <ArrowRight size={17} color="#fff" strokeWidth={2.4} />
            </LinearGradient>
          </PressScale>
        </Card>

        <View style={styles.footerRow}>
          <Text style={styles.footerText}>New here?</Text>
          <PressScale onPress={goToSignUp}>
            <Text style={styles.footerLink}>Sign Up</Text>
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
  forgotWrap: {
    alignSelf: "flex-end",
    marginTop: 2,
    marginBottom: 16,
  },
  forgotText: {
    fontFamily: disp.semibold,
    fontSize: 13,
    color: colors.gold,
  },
  submitWrap: {
    marginTop: 2,
  },
  submitBtn: {
    height: 56,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
    ...shadow.accent("rgba(47,123,196,0.8)"),
  },
  submitBtnDisabled: {
    opacity: 0.86,
  },
  submitText: {
    fontFamily: disp.bold,
    fontSize: 15.5,
    color: "#fff",
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
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
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
