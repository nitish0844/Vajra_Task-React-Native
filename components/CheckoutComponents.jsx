import { View, Text, TouchableOpacity, FlatList, StyleSheet, Image, Platform } from "react-native";
import { COLORS, SIZES, FONT_FAMILY, FONTS } from "@/constants/theme";
import { IconChevronUp, IconChevronDown } from "@tabler/icons-react-native";
import Counter from "./Counter";
import { memo, useMemo, useRef } from "react";
import placeholderImage from "@/assets/images/placeholder.jpg";

export const Product = memo(({
  quantity = 0,
  image,
  title,
  price,
  onChange,
  totalCount
}) => {
  // to fix the counter issue - set the total count to the sum of totalCount and quantity once
  const totalCountRef = useRef(totalCount+quantity);

  const isValidImage = image && image !== "null";
  return (
    <View style={styles.productContainer}>
      <View style={{ position: "relative" }}>
        <Image
          source={isValidImage ? { uri: image } : placeholderImage}
          style={{ width: 56, height: 56, borderRadius: 6 }}
          contentFit="cover"
        />
        <View style={styles.priceTag}>
          <Text style={styles.priceText}>
            ₹ {price}
          </Text>
        </View>
      </View>
      <View
        style={{
          flex: 1,
          justifyContent: "flex-start",
          paddingHorizontal: SIZES.padding,
        }}
      >
        <Text>{title}</Text>

        <Text style={{ ...FONTS.h6, color: COLORS.primary, marginTop: 2 }}>
          Available: {quantity}
        </Text>
      </View>

      <View style={{ alignItems: "center", justifyContent: "center" }}>
        <Counter max={totalCountRef?.current} start={totalCount} onChange={onChange} />
      </View>
    </View>
  );
});

export const Category = memo(({
  categoryName,
  products,
  onChange,
  isOpen,
  quantity,
  onToggle,
  isSCC,
  selectedProducts
}) => {
  const sortedProducts = useMemo(() => products.sort((a, b) => a.product_name.localeCompare(b.product_name)), [products]);
  return (
    <View style={styles.container}>
      <TouchableOpacity style={[styles.categoryContainer, { backgroundColor: isOpen ? "rgba(0, 96, 137, 0.3)" : "transparent" }]} onPress={onToggle}>
        <Text style={styles.categoryName}>{categoryName}</Text>

        <View style={styles.countContainer}>
          {quantity > 0 && (
            <Text style={styles.countText}>{quantity}</Text>
          )}

          {isOpen ? (
            <IconChevronUp size={24} color={"#fff"} />
          ) : (
            <IconChevronDown size={24} color={COLORS.primary} />
          )}
        </View>
      </TouchableOpacity>
      {isOpen && (
        <FlatList
          scrollEnabled={false}
          data={sortedProducts}
          keyExtractor={(item, index) => 'pc-'+item.product_id+'-'+index}
          renderItem={({ item, i }) => {
            const availableQuantity = item.available;
            // console.log(item);

            const isSelected = selectedProducts?.find(product => product.product_id === item.product_id);
            return (
              <Product
                title={item.product_name}
                image={item.product_image_url}
                price={item.selling_price}
                quantity={availableQuantity}
                totalCount={isSelected ? isSelected.quantity : item.quantity}
                onChange={(v) => onChange({ ...item, quantity: v })}
              />
            );
          }}
        />
      )}
    </View>
  );
});


const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.white,
    position: "relative",
  },
  listOuterContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.padding * 2,
    marginHorizontal: SIZES.padding * 2,
    paddingVertical: SIZES.padding,
    marginTop: -75,
    shadowColor: "rgba(0,0,0,.5)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.shade5,
    marginBottom: SIZES.padding,
  },
  listContainer: {
    flex: 1,
    paddingVertical: 10,
  },
  categoryContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: SIZES.padding * 2,
    paddingVertical: SIZES.padding,
  },
  categoryName: {
    ...FONTS.h5,
    fontFamily: FONT_FAMILY.semiBold,
    paddingVertical: SIZES.base,
  },
  productContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  priceTag: {
    backgroundColor: COLORS.primary,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: SIZES.padding / 3,
    ...Platform.select({
      ios: {
        borderBottomStartRadius: 8,
        borderBottomEndRadius: 8,
      },
      android: {
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8,
      },
    }),
  },
  priceText: {
    textAlign: "center",
    fontSize: 12,
    color: COLORS.white,
  },
  productDetails: {
    flex: 1,
    justifyContent: "flex-start",
    paddingHorizontal: SIZES.padding,
  },
  descriptionText: {
    color: COLORS.shade2,
  },
  availableText: {
    color: COLORS.shade1,
    fontSize: 12,
    marginTop: 2,
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
  countContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: SIZES.padding,
  },
});
