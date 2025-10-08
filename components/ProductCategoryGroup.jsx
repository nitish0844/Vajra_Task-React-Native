import { View, Text, TouchableOpacity, FlatList, StyleSheet, Image } from "react-native";
import { COLORS, SIZES, FONT_FAMILY, FONTS } from "@/constants/theme";
import { IconChevronUp, IconChevronDown, IconCoin } from "@tabler/icons-react-native";
import Counter from "./Counter";
import { memo, useMemo, useRef } from "react";

const placeholderImage = require('../assets/images/placeholder.jpg');

export const Product = ({
  product,
  quantity = 0,
  image,
  title,
  price,
  onChange,
  totalCount,
  showReasons,
  isFOC = false,
}) => {
  // to fix the counter issue - set the total count to the sum of totalCount and quantity once
  const totalCountRef = useRef(totalCount+quantity);
  return (
    <View style={styles.productContainer}>
      <View style={{ position: "relative" }}>
        <Image
          source={image || placeholderImage}
          style={{ width: 56, height: 56, borderRadius: 6 }}
          contentFit="cover"
        />
        <View style={styles.priceContainer}>
          <Text style={{ textAlign: "center", fontSize: 12, color: COLORS.white }}>
            { isFOC ? 'FOC' : '₹ '+price }
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

        {
          isFOC ? (
            <TouchableOpacity onPress={() => {
              showReasons(product);
            }}>
              <Text style={{ ...FONTS.h6, color: COLORS.primary, marginTop: 2 }}>
                Available: {quantity}
              </Text>
              <View style={{ flexDirection: "row", alignItems: "center", gap: SIZES.base/2 }} >
                <IconCoin size={16} color={COLORS.primary} strokeWidth={1.5} />
                <Text style={{ ...FONTS.h6, color: COLORS.primary }}>
                  {product?.newReason || product?.payment_exception_reasons}
                </Text>
              </View>
            </TouchableOpacity>
          ) : (
            <Text style={{ ...FONTS.h6, color: COLORS.primary, marginTop: 2 }}>
              Available: {quantity}
            </Text>
          )
        }
      </View>

      <View style={{ alignItems: "center", justifyContent: "center" }}>
        <Counter max={totalCountRef?.current} start={totalCount} onChange={onChange} />
      </View>
    </View>
  );
};

export const CategoryWithEdit = ({
  categoryName,
  products,
  onChange,
  isOpen,
  isFOC,
  onToggle,
  showReasons,
  selectedProducts
}) => {
  const totalCount = products?.reduce(
    (sum, item) => {
      const selectedProduct = selectedProducts?.find(product => product.product_id === item.product_id && product.payment_exception_reasons === item.payment_exception_reasons);
      return sum + (Number(selectedProduct?.quantity) || Number(item.quantity) || 0);
    },
    0
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={onToggle}
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          paddingHorizontal: SIZES.padding * 2,
          paddingVertical: SIZES.padding,
          backgroundColor: isOpen
            ? "rgba(0, 96, 137, 0.3)"
            : "transparent",
        }}
      >
        <Text style={styles.categoryName}>{categoryName}</Text>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: SIZES.padding,
          }}
        >
          {totalCount > 0 && (
            <Text style={styles.countText}>
              {totalCount}
            </Text>
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
          data={products}
          renderItem={({ item, i }) => {
            let selectedProduct = selectedProducts?.find(product => {
              return product.product_id === item.product_id && product.payment_exception_reasons === item.payment_exception_reasons;
            });
            // if the product is not selected, then use the item as the selected product
            if (!selectedProduct) {
              selectedProduct = item;
            }
            return (
              <Product
                key={selectedProduct.product_id}
                title={selectedProduct.product_name}
                price={selectedProduct.unit_price}
                quantity={selectedProduct.available}
                totalCount={selectedProduct.quantity}
                onChange={(v) => onChange({ ...selectedProduct, quantity: v }, i)}
                isFOC={isFOC}
                showReasons={showReasons}
                product={selectedProduct}
              />
            );
          }}
          keyExtractor={(item, index) => 'pc-'+item.product_id+'-'+index}
        />
      )}
    </View>
  );
};

const ProductListItem = memo(({ item }) => {
  return (
    <View style={styles.productViewItem}>
      <Text>{item.product_name}</Text>
      <Text>{item.quantity}</Text>
    </View>
  );
});

export const CategoryViewOnly = ({
  categoryName,
  products
}) => {
  const sortedProducts = useMemo(() => products.sort((a, b) => a.product_name.localeCompare(b.product_name)), [products]);
  return (
    <View style={styles.container}>
      <View style={styles.categoryHeader}>
        <Text style={styles.categoryName}>
          {categoryName}
        </Text>
      </View>

      <FlatList
        scrollEnabled={false}
        data={sortedProducts}
        renderItem={({ item }) => <ProductListItem item={item} />}
        keyExtractor={(item, index) => 'pc-'+item.product_id+'-'+index}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
  },
  productViewItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: SIZES.padding * 2,
    paddingVertical: SIZES.padding,
  },
  categoryName: {
    ...FONTS.h5,
    fontFamily: FONT_FAMILY.semiBold,
    paddingVertical: SIZES.base,
    // color: COLORS.primary,
  },
  categoryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: SIZES.base * 2,
    marginTop: SIZES.base,
    backgroundColor: "transparent",
  },
  priceContainer: {
    backgroundColor: COLORS.primary,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
  },
  productContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: SIZES.padding,
    paddingHorizontal: SIZES.padding * 1.5,
  },
  focText: {
    ...FONTS.h5,
    color: "#000",
    right: 20,
    textAlign: "center",
    alignItems: "center",
    justifyContent: "center",
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
  }
});
