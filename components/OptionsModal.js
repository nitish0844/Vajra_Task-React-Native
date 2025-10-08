import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Modal } from 'react-native';
import { SIZES, COLORS, FONTS } from '../constants/theme';

const OptionsModal = ({ label, options, show = false, onSelect, onClose,button }) => {
  const [data, setData] = useState(options);
  const [visible, setVisible] = useState(show);

  useEffect(() => {
    setVisible(show)
  }, [show]);

  useEffect(() => {
    setData(options)
  }, [options]);

  if(!visible) return null;

  if (options.length === 0) return null;

  return (
    <View style={{ width: "100%", height: "100%", position: "absolute" }}>
    <Modal
      visible={visible}
      onRequestClose={onClose}
      presentationStyle='overFullScreen'
      animationType='fade'
      transparent
      style={styles.modalRoot}
      >
      <TouchableOpacity style={styles.root} onPress={onClose} activeOpacity={1}>
        <View style={styles.modalContainer}>
          <View style={styles.listContainer}>
            <View style={styles.modalTitleContainer}>
              <Text style={styles.modalTitleText}>Choose {label}</Text>
            </View>
            <FlatList
              data={data}
              keyExtractor={(item, i) => `${item.label}-${i}`}
              showsVerticalScrollIndicator={false}
              style={styles.list}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.optionItem}
                  onPress={() => onSelect(item)}
                >
                  <Text style={{ ...FONTS.body5 }}>{item.label}</Text>
                </TouchableOpacity>
              )}
              ListFooterComponent={button}
            />
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  modalRoot: {
    zIndex: 1000,
    elevation: 1000,
  },
  root: {
    flex: 1,
    width: SIZES.width,
    height: SIZES.height,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.shade1trans,
  },
  modalContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', zIndex: 1 },
  listContainer: {
    maxHeight: SIZES.height * 0.75,
    width: SIZES.width * 0.8,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius / 2,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 5,

    elevation: 5,
  },
  modalTitleContainer: { padding: SIZES.padding, alignItems: 'center' },
  modalTitleText: { ...FONTS.h6 },
  list: { paddingVertical: SIZES.padding, marginBottom: SIZES.padding * 2 },
  optionItem: { padding: SIZES.padding, paddingLeft: SIZES.padding * 2, flexDirection: 'row' },
})

export default OptionsModal;
