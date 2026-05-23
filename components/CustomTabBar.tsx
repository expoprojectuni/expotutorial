import { useCategories } from "@/context/CategoriesContext";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { usePathname, useRouter } from "expo-router";
import { useRef, useState } from "react";
import {
  LayoutChangeEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const BG = "#0A0E1A";
const SURFACE = "#141A2E";
const BORDER = "#2A3458";
const TEXT_MUTED = "#5A6285";
const TEXT_DIM = "#8A93B8";
const NEON_PURPLE = "#B14EFF";

const TITULOS_BASE: Record<string, string> = {
  "saint-seiya": "saints",
  "hunter-x-hunter": "hunters",
  "one-piece": "pirates",
  categorias: "categorías",
  index: "resumen",
};

const TABS_VISIBLES = new Set([
  "saint-seiya",
  "hunter-x-hunter",
  "one-piece",
  "categorias",
  "index",
]);

export default function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  const { categorias } = useCategories();
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<ScrollView>(null);

  const [contentWidth, setContentWidth] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const [scrollX, setScrollX] = useState(0);

  const hayOverflow = contentWidth > containerWidth + 1;
  const puedeScrollIzq = hayOverflow && scrollX > 2;
  const puedeScrollDer = hayOverflow && scrollX + containerWidth < contentWidth - 2;

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    setScrollX(e.nativeEvent.contentOffset.x);
  };

  const onContentLayout = (w: number) => setContentWidth(w);

  const onContainerLayout = (e: LayoutChangeEvent) => {
    setContainerWidth(e.nativeEvent.layout.width);
  };

  const scrollPor = (dir: "izq" | "der") => {
    const delta = containerWidth * 0.6;
    const next =
      dir === "izq" ? Math.max(0, scrollX - delta) : Math.min(contentWidth, scrollX + delta);
    scrollRef.current?.scrollTo({ x: next, animated: true });
  };

  const irACategoria = (categoriaId: string) => {
    router.push(`/categoria/${categoriaId}`);
  };

  const animeActivoId = (() => {
    const match = pathname.match(/\/anime\/[^/]+\/([^/?#]+)/);
    return match ? match[1] : null;
  })();

  const categoriaActivaId = (() => {
    const match = pathname.match(/\/categoria\/([^/?#]+)/);
    return match ? match[1] : null;
  })();

  const enRutaOculta = animeActivoId !== null || categoriaActivaId !== null;
  const rutasVisibles = state.routes.filter((r) => TABS_VISIBLES.has(r.name));

  return (
    <View style={[styles.wrapper, { paddingBottom: insets.bottom }]}>
      <View style={styles.row} onLayout={onContainerLayout}>
        {puedeScrollIzq && (
          <TouchableOpacity style={styles.arrow} onPress={() => scrollPor("izq")} hitSlop={6}>
            <Text style={styles.arrowText}>‹</Text>
          </TouchableOpacity>
        )}

        <ScrollView
          ref={scrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          onScroll={onScroll}
          scrollEventThrottle={16}
          contentContainerStyle={styles.scrollContent}
          onContentSizeChange={onContentLayout}
          style={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          {rutasVisibles.map((route) => {
            const enCategorias = route.name === "categorias" && categoriaActivaId !== null;
            const enfocada =
              !enRutaOculta && state.routes[state.index]?.key === route.key
                ? true
                : enCategorias;
            const titulo = TITULOS_BASE[route.name] ?? route.name;

            const onPress = () => {
              const event = navigation.emit({
                type: "tabPress",
                target: route.key,
                canPreventDefault: true,
              });
              if (!enfocada && !event.defaultPrevented) {
                navigation.navigate(route.name, route.params);
              }
            };

            return (
              <TouchableOpacity
                key={route.key}
                onPress={onPress}
                style={[styles.tab, enfocada && styles.tabActive]}
              >
                <Text style={[styles.tabLabel, enfocada && styles.tabLabelActive]}>
                  {titulo}
                </Text>
                {enfocada && <View style={styles.activeBar} />}
              </TouchableOpacity>
            );
          })}

          {categorias.map((c) => {
            const enfocada = categoriaActivaId === c.id;
            return (
              <TouchableOpacity
                key={c.id}
                onPress={() => irACategoria(c.id)}
                style={[styles.tab, styles.tabDynamic, enfocada && styles.tabActive]}
              >
                <Text style={styles.tabDynamicTag}>◆</Text>
                <Text
                  style={[styles.tabLabel, enfocada && styles.tabLabelActive]}
                  numberOfLines={1}
                >
                  {c.nombre.toLowerCase()}
                </Text>
                {enfocada && <View style={styles.activeBar} />}
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {puedeScrollDer && (
          <TouchableOpacity style={styles.arrow} onPress={() => scrollPor("der")} hitSlop={6}>
            <Text style={styles.arrowText}>›</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: BG,
    borderTopWidth: 1,
    borderTopColor: BORDER,
  },
  row: {
    flexDirection: "row",
    alignItems: "stretch",
    height: 64,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    alignItems: "center",
    paddingHorizontal: 6,
  },
  tab: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 70,
    height: "100%",
  },
  tabDynamic: {
    flexDirection: "row",
    gap: 6,
    paddingHorizontal: 14,
    maxWidth: 160,
  },
  tabActive: {},
  tabLabel: {
    color: TEXT_MUTED,
    fontSize: 11,
    letterSpacing: 1.5,
    fontWeight: "500",
  },
  tabLabelActive: {
    color: NEON_PURPLE,
  },
  tabDynamicTag: {
    color: NEON_PURPLE,
    fontSize: 8,
  },
  activeBar: {
    position: "absolute",
    top: 0,
    left: 12,
    right: 12,
    height: 2,
    backgroundColor: NEON_PURPLE,
  },
  arrow: {
    width: 32,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: SURFACE,
    borderRightWidth: 1,
    borderLeftWidth: 1,
    borderColor: BORDER,
  },
  arrowText: {
    color: TEXT_DIM,
    fontSize: 22,
    fontWeight: "300",
    marginTop: -2,
  },
});
