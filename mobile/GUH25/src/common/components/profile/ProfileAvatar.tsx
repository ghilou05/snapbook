import { View, Image, StyleSheet } from "react-native";

interface IProps {
    width: number;
    height: number;
}

export default function ProfileAvatar(props: IProps) {
    const styles = StyleSheet.create({
        // Profile Image
        profileImageContainer: {
            position: 'relative',
        },
        profileImage: {
            width: props.width,
            height: props.height,
            borderRadius: props.width / 2,
            backgroundColor: '#f0f0f0',
        },
    });

    return(
        <View style={styles.profileImageContainer}>
            <Image
                source={{
                    uri: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face&auto=format'
                }}
                style={styles.profileImage}
            />
        </View>
    )
}
