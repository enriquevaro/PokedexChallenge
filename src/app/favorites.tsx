import { Ionicons } from '@expo/vector-icons';
import {
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { StatBar } from '@/features/pokemon/components/StatBar';

export default function FavoritesScreen() {

    return(
        <view style={styles.container}>
            <Text style={styles.title}>Favorites</Text>
        </view>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    title: {
        fontSize: 20,
    }
})