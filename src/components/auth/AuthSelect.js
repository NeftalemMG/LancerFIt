import React, { useMemo, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { colors, radius, shadow } from '../../theme/tokens';
import { disp, body } from '../../theme/typography';
import { Card, PressScale } from '../ui';
import { ChevronRight } from '../icons';

export default function AuthSelect({
  label,
  value,
  options,
  placeholder,
  searchPlaceholder,
  onChange,
  error,
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');

  const selectedOption = useMemo(() => options.find((option) => option.value === value), [options, value]);
  const filteredOptions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter((option) => {
      const haystack = `${option.label} ${option.value}`.toLowerCase();
      return haystack.includes(q);
    });
  }, [options, query]);

  const close = () => {
    setOpen(false);
    setQuery('');
  };

  return (
    <View style={styles.block}>
      <Text style={styles.label}>{label}</Text>
      <PressScale onPress={() => setOpen(true)}>
        <View style={[styles.box, error && styles.boxError]}>
          <Text numberOfLines={1} style={[styles.input, !selectedOption && styles.placeholder]}>
            {selectedOption ? selectedOption.label : placeholder}
          </Text>
          <ChevronRight size={15} color={colors.text3} strokeWidth={2.4} />
        </View>
      </PressScale>
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Modal visible={open} transparent animationType="fade" onRequestClose={close}>
        <View style={styles.modalRoot}>
          <Pressable style={StyleSheet.absoluteFill} onPress={close} />
          <Card style={styles.panel}>
            <View style={styles.grab} />
            <Text style={styles.panelTitle}>{label}</Text>
            <View style={styles.searchBox}>
              <TextInput
                value={query}
                onChangeText={setQuery}
                placeholder={searchPlaceholder}
                placeholderTextColor={colors.text3}
                autoCapitalize="none"
                autoCorrect={false}
                style={styles.searchInput}
              />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.list} keyboardShouldPersistTaps="handled">
              {filteredOptions.map((option) => {
                const selected = option.value === value;
                const meta = option.meta || (option.value.length <= 12 ? option.value.toUpperCase() : '');
                return (
                  <PressScale
                    key={option.value}
                    onPress={() => {
                      onChange(option.value);
                      close();
                    }}
                    style={styles.optionWrap}
                  >
                    <View style={[styles.option, selected && styles.optionSelected]}>
                      <View style={styles.optionTextWrap}>
                        <Text style={[styles.optionLabel, selected && styles.optionLabelSelected]}>{option.label}</Text>
                        {meta ? <Text style={styles.optionMeta}>{meta}</Text> : null}
                      </View>
                      {selected ? <Text style={styles.check}>Selected</Text> : <ChevronRight size={14} color={colors.text3} strokeWidth={2.2} />}
                    </View>
                  </PressScale>
                );
              })}
              {filteredOptions.length === 0 ? <Text style={styles.empty}>No matches found.</Text> : null}
            </ScrollView>
          </Card>
        </View>
      </Modal>
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
    minHeight: 54,
    paddingHorizontal: 16,
    paddingVertical: 13,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.cardLine,
    backgroundColor: colors.card,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  boxError: {
    borderColor: 'rgba(224,168,56,0.75)',
  },
  input: {
    flex: 1,
    padding: 0,
    fontFamily: disp.semibold,
    fontSize: 16,
    color: colors.text,
    letterSpacing: -0.2,
  },
  placeholder: {
    color: colors.text3,
  },
  error: {
    marginTop: 7,
    fontFamily: body.medium,
    fontSize: 11.5,
    lineHeight: 16,
    color: colors.gold,
  },
  modalRoot: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(3,18,33,0.55)',
  },
  panel: {
    paddingTop: 10,
    paddingHorizontal: 16,
    paddingBottom: 18,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderWidth: 1,
    borderColor: colors.cardLine2,
    ...shadow.pop,
  },
  grab: {
    width: 42,
    height: 5,
    borderRadius: 99,
    backgroundColor: 'rgba(255,255,255,0.22)',
    alignSelf: 'center',
    marginBottom: 12,
  },
  panelTitle: {
    fontFamily: disp.bold,
    fontSize: 21,
    letterSpacing: -0.4,
    color: colors.text,
    marginBottom: 12,
  },
  searchBox: {
    height: 52,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.cardLine,
    backgroundColor: colors.card,
    justifyContent: 'center',
    marginBottom: 14,
  },
  searchInput: {
    padding: 0,
    fontFamily: body.medium,
    fontSize: 14,
    color: colors.text,
  },
  list: {
    paddingBottom: 8,
  },
  optionWrap: {
    marginBottom: 10,
  },
  option: {
    minHeight: 54,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.cardLine,
    backgroundColor: colors.card,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  optionSelected: {
    borderColor: colors.goldLine,
    backgroundColor: colors.goldSoft,
  },
  optionTextWrap: {
    flex: 1,
    minWidth: 0,
  },
  optionLabel: {
    fontFamily: disp.semibold,
    fontSize: 13.5,
    color: colors.text,
  },
  optionLabelSelected: {
    color: colors.gold,
  },
  optionMeta: {
    marginTop: 3,
    fontFamily: body.semibold,
    fontSize: 10,
    letterSpacing: 1,
    color: colors.text3,
  },
  check: {
    fontFamily: disp.bold,
    fontSize: 11,
    color: colors.gold,
  },
  empty: {
    marginTop: 8,
    fontFamily: body.medium,
    fontSize: 12,
    color: colors.text3,
    textAlign: 'center',
  },
});
