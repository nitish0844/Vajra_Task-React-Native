import { View, Text, TouchableOpacity, FlatList, Image, StyleSheet, Platform } from 'react-native';
import { SIZES, FONT_FAMILY, COLORS, FONTS } from '@/constants/theme';
import Counter from './Counter';
import { IconChevronDown, IconChevronUp } from '@tabler/icons-react-native';
import placeholderImage from '@/assets/images/placeholder.jpg';

const Product = ({
  image,
  title,
  description,
  price,
  available,
  quantity,
  onChange,
  initialOpening
}) => {
  const isValidImage = image && image !== "null";
  return (
    <View style={styles.productContainer}>
      <View style={{ position: "relative" }}>
        <Image
          source={isValidImage ? { uri: image } : placeholderImage}
          style={{ width: 64, height: 64, borderRadius: 6 }}
          contentFit="cover"
        />
        <View style={styles.priceTag}>
          <Text style={styles.priceText}>₹ {price}</Text>
        </View>
      </View>
      <View style={styles.productDetails}>
        <Text>{title}</Text>
        <Text style={styles.descriptionText} numberOfLines={1}>
          {description}
        </Text>
        {/* <Text style={styles.availableText}>Available: {available}</Text> */}
        <Text style={styles.availableText}>Confirm Quantity</Text>
      </View>
      <View style={{ alignItems: "center", justifyContent: "center" }}>
        <Counter onChange={onChange} start={quantity} max={available} initialOpening={initialOpening} />
      </View>
    </View>
  );
};

export const Category = ({
  categoryName,
  products,
  totalQuantity,
  onChange,
  isOpen,
  onToggle,
  isSCC,
  initialOpening
}) => {
  const sortedProducts = products.sort((a, b) => {
    if (a.categoryName < b.categoryName) return -1;
    if (a.categoryName > b.categoryName) return 1;
    return 0;
  });


  const productsWithOpening = sortedProducts.map((product) => {
    const openingData = initialOpening.find(
      (opening) => opening.product_id === product.product_id
    );
    return {
      ...product,
      initialOpening: openingData ? openingData.opening_quantity : 0, // Default to 0 if no opening data found
    };
  });


  return (
    <View
      style={{
        borderBottomWidth: 1,
        borderColor: "#ccc",
      }}
    >
      <TouchableOpacity
        onPress={onToggle}
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          paddingHorizontal: SIZES.width * 0.05,
          paddingVertical: SIZES.padding,
          backgroundColor: isOpen ? "rgba(0, 96, 137, 0.3)" : "transparent",
        }}
      >
        <Text
          style={{ fontFamily: FONT_FAMILY.semiBold, padding: SIZES.padding }}
        >
          {categoryName}
        </Text>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: SIZES.padding,
          }}
        >
          {totalQuantity > 0 && (
            <Text style={styles.countText}>{totalQuantity}</Text>
          )}
          {isOpen ? (
            <IconChevronUp size={24} color={COLORS.primary} />
          ) : (
            <IconChevronDown size={24} color={COLORS.primary} />
          )}
        </View>
      </TouchableOpacity>
      {isOpen && (
        <FlatList
          scrollEnabled={false}
          data={productsWithOpening}
          renderItem={({ item, i }) => {
            const quantities = isSCC ? item.opening_scc : item.opening_cc;

            return (
              <Product
                key={item.id + "-" + i}
                title={item.product_name}
                price={item.selling_price}
                quantity={quantities}
                onChange={(v) => onChange(item, v)}
                available={item.available_quantity}
                image={item.product_image_url}
                initialOpening={item.initialOpening}
              />
            );
          }}
          keyExtractor={(item) => item?.id?.toString()}
        />
      )}
    </View>
  );
};

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
  categoryName: {
    ...FONTS.h5,
    fontFamily: FONT_FAMILY.semiBold,
    paddingVertical: SIZES.base,
    // color: COLORS.primary,
  },
});