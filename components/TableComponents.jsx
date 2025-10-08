import { StyleSheet, View, Text } from 'react-native';
import { COLORS, FONT_FAMILY, FONTS, SIZES } from '@/constants/theme';

export const Table = ({ children }) => {
  return (
    <View style={styles.tableContainer}>
      {children}
    </View>
  );
}

export const TableHeader = ({ headers }) => {
  return (
    <View style={styles.tableHeader}>
      {headers.map((header, index) => (
        <Text key={index} style={[styles.th, header?.style]}>{header?.value}</Text>
      ))}
    </View>
  );
}

export const TableRow = ({ row }) => {
  return (
    <View style={styles.tableRow}>
      {row.map((cell, index) => (
        <Text key={index} style={[styles.td, cell?.style]}>{cell?.value}</Text>
      ))}
    </View>
  );
}

export const TableFooter = ({ footer }) => {
  return (
    <View style={styles.tableFooter}>
      {footer.map((cell, index) => (
        <Text key={index} style={[styles.th, cell?.style]}>{cell?.value}</Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  tableContainer: {
    flexDirection: 'column'
  },
  tableHeader: {
    // height: 56,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: COLORS.secondary,
    backgroundColor: COLORS.primary2,
    paddingHorizontal: SIZES.padding
  },
  th: {
    flex: 1,
    ...FONTS.h6,
    fontSize: SIZES.h6 - 1,
    textAlign: 'left',
    color: COLORS.white,
    padding: SIZES.padding / 1.5,
    fontFamily: FONT_FAMILY.semiBold
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.shade4,
    // height: 38,
    paddingHorizontal: SIZES.padding
  },
  td: {
    flex: 1,
    ...FONTS.body6,
    color: COLORS.black2,
    textAlign: 'left',
    padding: SIZES.padding / 1.5
  },
  right: {
    textAlign: 'right'
  },
  tableFooter: {
    flexDirection: 'row',
    borderTopWidth: 1,
    // height: 38,
    borderColor: COLORS.secondary,
    backgroundColor: COLORS.primary2,
    paddingHorizontal: SIZES.padding
  },
});
