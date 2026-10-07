import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { BlurView } from 'expo-blur';
import { ActivityIndicator, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Backdrop } from '../components/Backdrop';
import { HighlightTile } from '../components/HighlightTile';
import { Hero } from '../components/Hero';
import { MarketSwitch } from '../components/MarketSwitch';
import { MoverList } from '../components/MoverList';
import { SummaryCard } from '../components/SummaryCard';
import { TopTabs } from '../components/TopTabs';
import { WatchlistCard } from '../components/WatchlistCard';
import { useApp } from '../context/AppContext';
import { formatDateTime } from '../format';
import { useMovers } from '../hooks/useMovers';
import { useTheme } from '../theme';
import { isMarket, MARKET_CURRENCY, type Mover } from '../types/movers';

type Tab = 'market' | 'watchlist';

export default function HomeScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState<Tab>('market');
  const [bottomBarHeight, setBottomBarHeight] = useState(0);
  const { market, setMarket, watchlist, isWatched, toggleWatch } = useApp();
  const { data, loading, staleSince, error, reload } = useMovers(market);
  const scrollRef = useRef<ScrollView>(null);
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);

  // The hero shows the index again after switching markets.
  useEffect(() => setSelectedSymbol(null), [market]);

  // Deep link from the widget: gielda://?market=usa
  const params = useLocalSearchParams<{ market?: string }>();
  useEffect(() => {
    if (isMarket(params.market)) setMarket(params.market);
  }, [params.market, setMarket]);

  const currency = MARKET_CURRENCY[market];
  const topGainer = data?.gainers[0];
  const topLoser = data?.losers[0];
  const allMovers = data ? [...data.gainers, ...data.losers] : [];
  const selectedMover = allMovers.find((m) => m.symbol === selectedSymbol) ?? null;
  const marketWatchlist = watchlist.filter((c) => c.market === market);

  // Tapping the selected company again goes back to the index.
  const select = (mover: Mover) => {
    setSelectedSymbol((prev) => (prev === mover.symbol ? null : mover.symbol));
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  };

  // From the watchlist tab: open the company in the hero on the market tab.
  const openFromWatchlist = (mover: Mover) => {
    setTab('market');
    setSelectedSymbol(mover.symbol);
    scrollRef.current?.scrollTo({ y: 0, animated: false });
  };

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <Backdrop />
      <View style={styles.top}>
        <View style={styles.topInner}>
          <View style={styles.header}>
            <View style={styles.headerText}>
              <Text style={[styles.title, { color: theme.text }]}>Giełda</Text>
              <Text style={[styles.subtitle, { color: theme.muted }]}>Kto dziś rządził, a kto oberwał</Text>
            </View>
            <Pressable
              onPress={() => router.push('/settings')}
              accessibilityRole="button"
              accessibilityLabel="Ustawienia"
              style={[styles.iconButton, { backgroundColor: theme.glass, borderColor: theme.glassBorder }]}
            >
              <Ionicons name="settings-outline" size={22} color={theme.text} />
            </Pressable>
          </View>
          <TopTabs
            tabs={[
              { key: 'market', label: 'Rynek', icon: 'stats-chart' },
              { key: 'watchlist', label: 'Obserwowane', icon: 'star', badge: marketWatchlist.length },
            ]}
            value={tab}
            onChange={setTab}
          />
        </View>
      </View>

      <ScrollView
        ref={scrollRef}
        contentContainerStyle={[styles.content, { paddingBottom: bottomBarHeight + 24 }]}
        refreshControl={<RefreshControl refreshing={loading && !!data} onRefresh={reload} />}
      >
        {staleSince && (
          <View style={[styles.banner, { backgroundColor: theme.warningBg }]}>
            <Ionicons name="cloud-offline-outline" size={18} color={theme.warningText} />
            <Text style={[styles.bannerText, { color: theme.warningText }]}>
              Brak połączenia – pokazuję dane zapisane {formatDateTime(staleSince)}.
            </Text>
          </View>
        )}

        {tab === 'market' && !data && loading && <ActivityIndicator style={styles.loader} size="large" color={theme.accent} />}

        {tab === 'market' && !data && !loading && (
          <View style={styles.empty}>
            <Ionicons name="cloud-offline-outline" size={40} color={theme.muted} />
            <Text style={{ color: theme.text, textAlign: 'center' }}>Nie udało się pobrać danych.</Text>
            {error && <Text style={{ color: theme.muted, textAlign: 'center' }}>{error}</Text>}
            <Pressable onPress={reload} accessibilityRole="button">
              <Text style={{ color: theme.accent, fontWeight: '700' }}>Spróbuj ponownie</Text>
            </Pressable>
          </View>
        )}

        {tab === 'watchlist' &&
          (marketWatchlist.length > 0 ? (
            <WatchlistCard
              companies={marketWatchlist}
              movers={allMovers}
              onSelect={openFromWatchlist}
              onUnwatch={toggleWatch}
            />
          ) : (
            <View style={styles.empty}>
              <Ionicons name="star-outline" size={44} color={theme.muted} />
              <Text style={[styles.emptyTitle, { color: theme.text }]}>Nic tu jeszcze nie ma</Text>
              <Text style={[styles.emptyText, { color: theme.muted }]}>
                W zakładce Rynek kliknij spółkę i wybierz „Obserwuj”, żeby pojawiła się tutaj.
              </Text>
            </View>
          ))}

        {tab === 'market' && data && (
          <>
            <Hero
              data={data}
              mover={selectedMover}
              watched={selectedMover ? isWatched(market, selectedMover.symbol) : false}
              onToggleWatch={() =>
                selectedMover && toggleWatch({ market, symbol: selectedMover.symbol, name: selectedMover.name })
              }
              onClose={() => setSelectedSymbol(null)}
            />

            {topGainer && topLoser && (
              <View style={styles.tiles}>
                <HighlightTile
                  label="Lider sesji"
                  icon="rocket-outline"
                  mover={topGainer}
                  selected={selectedSymbol === topGainer.symbol}
                  onPress={() => select(topGainer)}
                />
                <HighlightTile
                  label="Największy spadek"
                  icon="arrow-down-circle-outline"
                  mover={topLoser}
                  selected={selectedSymbol === topLoser.symbol}
                  onPress={() => select(topLoser)}
                />
              </View>
            )}

            <SummaryCard summary={data.summary} source={data.summarySource} />
            <MoverList
              title="Największe wzrosty"
              direction="up"
              movers={data.gainers}
              currency={currency}
              selectedSymbol={selectedSymbol}
              isWatched={(symbol) => isWatched(market, symbol)}
              onSelect={select}
            />
            <MoverList
              title="Największe spadki"
              direction="down"
              movers={data.losers}
              currency={currency}
              selectedSymbol={selectedSymbol}
              isWatched={(symbol) => isWatched(market, symbol)}
              onSelect={select}
            />

            <Text style={[styles.footer, { color: theme.muted }]}>
              Dane z {formatDateTime(data.asOf)}
              {data.delayedMinutes > 0 ? ` · dane opóźnione o ${data.delayedMinutes} min` : ' · dane z końca dnia'}
            </Text>
          </>
        )}
      </ScrollView>

      {/* Floats over the content so the list scrolls underneath the frosted bar. */}
      <View
        onLayout={(e) => setBottomBarHeight(e.nativeEvent.layout.height)}
        style={[styles.bottomBar, { borderTopColor: theme.glassBorder, paddingBottom: Math.max(insets.bottom, 12) }]}
      >
        <BlurView intensity={60} tint={theme.blurTint} style={StyleSheet.absoluteFill} />
        <View style={[StyleSheet.absoluteFill, { backgroundColor: theme.glass }]} />
        <View style={styles.bottomInner}>
          <MarketSwitch value={market} onChange={setMarket} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  top: {
    paddingHorizontal: 16,
  },
  topInner: {
    width: '100%',
    maxWidth: 640,
    alignSelf: 'center',
    gap: 12,
  },
  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
    borderTopWidth: 1,
    paddingTop: 12,
    paddingHorizontal: 16,
  },
  bottomInner: {
    width: '100%',
    maxWidth: 640,
    alignSelf: 'center',
  },
  content: {
    padding: 16,
    gap: 16,
    width: '100%',
    maxWidth: 640,
    alignSelf: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 8,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderRadius: 14,
    padding: 12,
  },
  bannerText: {
    flex: 1,
  },
  loader: {
    marginTop: 60,
  },
  empty: {
    marginTop: 40,
    gap: 10,
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  emptyText: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
  tiles: {
    flexDirection: 'row',
    gap: 12,
  },
  footer: {
    fontSize: 12,
    textAlign: 'center',
  },
});
