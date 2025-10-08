import { memo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SIZES, FONT_FAMILY, COLORS, FONTS } from '@/constants/theme';
import { IconChevronDown, IconChevronUp } from '@tabler/icons-react-native';
import { Table, TableFooter, TableHeader, TableRow } from './TableComponents';

export const Category = memo(({
  categoryName,
  products,
  openingTotal,
  availableTotal,
  isOpen,
  onToggle,
}) => {
  const sortedProducts = products.sort((a, b) => a.product_name?.localeCompare(b.product_name));

  return (
    <View style={styles.categoryContainer}>
      <TouchableOpacity
        onPress={onToggle}
        style={[
          styles.categoryHeader,
          isOpen && styles.categoryHeaderOpen
        ]}
      >
        <Text style={styles.categoryTitle}>
          {categoryName}
        </Text>

        <View style={styles.categoryHeaderRight}>
          {openingTotal > 0 && (
            <Text style={styles.countText}>{openingTotal} - {availableTotal}</Text>
          )}
          {isOpen ? (
            <IconChevronUp size={24} color={COLORS.primary} />
          ) : (
            <IconChevronDown size={24} color={COLORS.primary} />
          )}
        </View>
      </TouchableOpacity>
      {
        isOpen && (
          <Table>
            <TableHeader headers={[
              { value: 'Product', style: { flex: 3 } },
              { value: 'Opening', style: styles.right },
              { value: 'Available', style: styles.right },
            ]} />
            {
              sortedProducts.map((product, index) => (
                <TableRow key={`${product.product_id}-${index}`} row={[
                  { value: product.product_name, style: { flex: 3 } },
                  { value: product.opening, style: styles.right },
                  { value: product.available, style: styles.right },
                ]} />
              ))
            }
            <TableFooter footer={[
              { value: 'Total', style: { flex: 3, textAlign: 'right' } },
              { value: openingTotal, style: styles.right },
              { value: availableTotal, style: styles.right },
            ]} />
          </Table>
        )
      }
    </View>
  );
});

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.white,
    position: "relative",
  },
  tableContainer: {
    flexDirection: "column",
  },
  tableHeader: {
    // height: 44,
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: COLORS.secondary,
    backgroundColor: COLORS.primary2,
  },
  th: {
    flex: 1,
    ...FONTS.h5,
    textAlign: "left",
    color: COLORS.white,
    padding: SIZES.base,
    // paddingVertical: SIZES.padding / 2,
    fontFamily: FONT_FAMILY.semiBold,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.shade4,
    // height: 44
  },
  td: {
    flex: 1,
    ...FONTS.body5,
    color: COLORS.black2,
    textAlign: "left",
    padding: SIZES.base,
    // paddingVertical: SIZES.padding / 2,
  },
  right: {
    textAlign: "right",
  },
  tableFooter: {
    flexDirection: "row",
    borderTopWidth: 1,
    // height: 44,
    borderColor: COLORS.secondary,
    backgroundColor: COLORS.primary2,
  },
  countText: {
    fontFamily: FONT_FAMILY.semiBold,
    padding: SIZES.padding * 0.5,
    backgroundColor: "#fff",
    borderRadius: SIZES.padding * 3,
    textAlign: "center",
    alignSelf: "center",
    minWidth: SIZES.padding * 2.5,
    minHeight: SIZES.padding,
  },
  categoryContainer: {
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  categoryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: SIZES.width * 0.05,
    paddingVertical: SIZES.padding,
  },
  categoryHeaderOpen: {
    backgroundColor: "rgba(0, 96, 137, 0.3)",
  },
  categoryTitle: {
    fontFamily: FONT_FAMILY.semiBold,
    padding: SIZES.padding,
  },
  categoryHeaderRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: SIZES.padding,
  },
  right: {
    textAlign: 'right'
  }
});