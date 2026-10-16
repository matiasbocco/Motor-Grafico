import { TouchableOpacity, Image, StyleSheet } from "react-native"

export function HeaderButton({ onPress, source, margin }) {

    return ( 
        <TouchableOpacity
            style = {[styles.smallButton, margin]}
            onPress={ onPress }
        >
            <Image 
                source={ source }
                style = {styles.smallButtonImage}
            />

        </TouchableOpacity>
    )
}

export default HeaderButton;

const styles = StyleSheet.create({
    smallButton: {
        
    },
    smallButtonImage: {
        width: 25,
        height: 25
    },
});


