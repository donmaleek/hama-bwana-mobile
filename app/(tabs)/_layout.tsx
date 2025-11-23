// app/(tabs)/_layout.tsx - World-Class Enhanced with Premium FAB
import { Ionicons } from "@expo/vector-icons";
import { Tabs, router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Premium badge component with animation
const TabBadge = ({ count, isPremium }: { count: number; isPremium?: boolean }) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (count > 0) {
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 300,
        friction: 5,
        useNativeDriver: true,
      }).start();
    }
  }, [count]);

  return (
    <Animated.View 
      style={[
        styles.badge,
        isPremium && styles.premiumBadge,
        {
          transform: [{ scale: scaleAnim }],
          opacity: scaleAnim
        }
      ]}
    >
      <Text style={[styles.badgeText, isPremium && styles.premiumBadgeText]}>
        {count > 9 ? '9+' : count}
      </Text>
    </Animated.View>
  );
};

// Premium indicator for premium features
const PremiumIndicator = () => (
  <View style={styles.premiumIndicator}>
    <Ionicons name="diamond" size={8} color="#DAA520" />
  </View>
);

export default function TabLayout() {
  const [activeTab, setActiveTab] = useState('index');
  const fabScale = useRef(new Animated.Value(1)).current;
  const fabRotation = useRef(new Animated.Value(0)).current;

  // Enhanced tab badges with premium indicators
  const tabBadges = {
    index: { count: 0, premium: false },
    explore: { count: 5, premium: true },
    featured: { count: 3, premium: true },
    map: { count: 0, premium: false },
    profile: { count: 2, premium: false },
  };

  const handleTabPress = (routeName: string) => {
    setActiveTab(routeName);
  };

  const handleFabPress = () => {
    // Animate FAB on press
    Animated.sequence([
      Animated.timing(fabScale, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(fabScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(fabRotation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      })
    ]).start(() => {
      fabRotation.setValue(0);
      router.push("/publish");
    });
  };

  const rotateInterpolate = fabRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg']
  });

  const getTabIcon = (routeName: string, focused: boolean, color: string, size: number) => {
    const icons = {
      index: focused ? "home" : "home-outline",
      explore: focused ? "search" : "search-outline",
      featured: focused ? "diamond" : "diamond-outline",
      map: focused ? "map" : "map-outline",
      profile: focused ? "person" : "person-outline",
    };

    return (
      <View style={styles.iconContainer}>
        <Ionicons 
          name={icons[routeName as keyof typeof icons]} 
          size={size} 
          color={color} 
        />
        {tabBadges[routeName as keyof typeof tabBadges].count > 0 && (
          <TabBadge 
            count={tabBadges[routeName as keyof typeof tabBadges].count}
            isPremium={tabBadges[routeName as keyof typeof tabBadges].premium}
          />
        )}
        {tabBadges[routeName as keyof typeof tabBadges].premium && !focused && (
          <PremiumIndicator />
        )}
      </View>
    );
  };

  // Safe web style injection
  useEffect(() => {
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      const styleSheet = document.createElement('style');
      styleSheet.innerText = `
        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 0.4;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.2;
          }
          100% {
            transform: scale(1);
            opacity: 0.4;
          }
        }
      `;
      document.head.appendChild(styleSheet);
      
      return () => {
        if (document.head.contains(styleSheet)) {
          document.head.removeChild(styleSheet);
        }
      };
    }
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: "#003366",
          tabBarInactiveTintColor: "#666",
          tabBarStyle: styles.tabBar,
          tabBarLabelStyle: styles.tabBarLabel,
          tabBarHideOnKeyboard: true,
          tabBarBackground: () => (
            <View style={styles.tabBarBackground} />
          ),
        }}
        screenListeners={{
          tabPress: (e) => {
            const routeName = e.target?.split('-')[0];
            if (routeName) {
              handleTabPress(routeName);
            }
          },
        }}
      >
        <Tabs.Screen 
          name="index" 
          options={{
            title: "Home",
            tabBarIcon: ({ focused, color, size }) => 
              getTabIcon("index", focused, color, size),
          }}
        />
        
        <Tabs.Screen 
          name="explore" 
          options={{
            title: "Explore",
            tabBarIcon: ({ focused, color, size }) => 
              getTabIcon("explore", focused, color, size),
          }}
        />
        
        {/* Hidden screen for publish - we'll use an enhanced FAB instead */}
        <Tabs.Screen 
          name="publish" 
          options={{
            href: null,
          }}
        />
        
        <Tabs.Screen 
          name="featured" 
          options={{
            title: "Premium",
            tabBarIcon: ({ focused, color, size }) => 
              getTabIcon("featured", focused, color, size),
          }}
        />
        
        <Tabs.Screen 
          name="map" 
          options={{
            title: "Map",
            tabBarIcon: ({ focused, color, size }) => 
              getTabIcon("map", focused, color, size),
          }}
        />
        
        <Tabs.Screen 
          name="profile" 
          options={{
            title: "Profile",
            tabBarIcon: ({ focused, color, size }) => 
              getTabIcon("profile", focused, color, size),
          }}
        />
      </Tabs>

      {/* World-Class Floating Action Button */}
      <Animated.View 
        style={[
          styles.floatingButtonContainer,
          {
            transform: [
              { scale: fabScale },
              { rotate: rotateInterpolate }
            ]
          }
        ]}
      >
        <TouchableOpacity
          style={styles.floatingButton}
          onPress={handleFabPress}
          activeOpacity={0.8}
        >
          <View style={styles.fabContent}>
            <Ionicons name="add" size={24} color="white" />
            {/* Remove the web-only pulse element that requires CSS animations */}
          </View>
          
          {/* FAB Tooltip - Only show on web with safe check */}
          {Platform.OS === 'web' && typeof document !== 'undefined' && (
            <View style={styles.fabTooltip}>
              <Text style={styles.fabTooltipText}>List Your Property</Text>
              <View style={styles.tooltipArrow} />
            </View>
          )}
        </TouchableOpacity>

        {/* Quick Actions Menu (Appears on long press) */}
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.quickAction}>
            <Ionicons name="camera" size={18} color="#003366" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickAction}>
            <Ionicons name="document" size={18} color="#003366" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickAction}>
            <Ionicons name="business" size={18} color="#003366" />
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Active Tab Indicator */}
      <View style={styles.activeTabIndicator}>
        <View 
          style={[
            styles.indicatorLine,
            {
              transform: [{
                translateX: (SCREEN_WIDTH / 5) * 
                ['index', 'explore', 'featured', 'map', 'profile'].indexOf(activeTab)
              }]
            }
          ]} 
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  tabBarBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  tabBar: {
    backgroundColor: 'transparent',
    borderTopWidth: 0,
    height: Platform.OS === 'ios' ? 95 : 80,
    paddingBottom: Platform.OS === 'ios' ? 35 : 15,
    paddingTop: 12,
    elevation: 0,
    shadowOpacity: 0,
    position: 'relative',
  },
  tabBarLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 6,
    letterSpacing: -0.2,
  },
  iconContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    right: -4,
    top: -2,
    backgroundColor: '#FF4444',
    borderRadius: 10,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'white',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
      },
      android: {
        elevation: 4,
      },
    })
  },
  premiumBadge: {
    backgroundColor: '#DAA520',
    minWidth: 18,
    height: 18,
  },
  badgeText: {
    color: 'white',
    fontSize: 9,
    fontWeight: '800',
  },
  premiumBadgeText: {
    fontSize: 8,
  },
  premiumIndicator: {
    position: 'absolute',
    top: -1,
    right: -1,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DAA520',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    })
  },
  floatingButtonContainer: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 105 : 85,
    right: 20,
    zIndex: 1000,
  },
  floatingButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#003366',
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
      },
      android: {
        elevation: 12,
      },
    })
  },
  fabContent: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Removed fabPulse style since it requires CSS animations
  fabTooltip: {
    position: 'absolute',
    bottom: 70,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    opacity: 0, // Keep hidden for now to avoid SSR issues
    transform: [{ translateY: 10 }],
  },
  fabTooltipText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  tooltipArrow: {
    position: 'absolute',
    bottom: -4,
    right: 20,
    width: 8,
    height: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    transform: [{ rotate: '45deg' }],
  },
  quickActions: {
    position: 'absolute',
    bottom: 70,
    right: 0,
    flexDirection: 'column',
    gap: 8,
    opacity: 0, // Keep hidden for now
    transform: [{ scale: 0.8 }],
  },
  quickAction: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    })
  },
  activeTabIndicator: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 95 : 80,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: 'transparent',
  },
  indicatorLine: {
    width: SCREEN_WIDTH / 5,
    height: 3,
    backgroundColor: '#003366',
    borderRadius: 2,
    marginLeft: (SCREEN_WIDTH / 5) * 0.1,
  },
});