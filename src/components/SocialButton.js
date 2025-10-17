const {Image, StyleSheet} = require('react-native');
const {Pressable} = require('react-native');
const {wp, colors} = require('../constants/Constants');

const SocialButton = props => {
  return (
    <Pressable style={styles.socialButton} onPress={props.onPress}>
      <Image
        source={
          props.type == 'google'
            ? require('../assets/icons/google.png')
            : require('../assets/icons/facebook.png')
        }
        style={styles.socialButtonImage}
      />
    </Pressable>
  );
};
export default SocialButton;
const styles = StyleSheet.create({
  socialButton: {
    padding: 10,
    backgroundColor: colors.white,
    elevation: 10,
    borderRadius: 10,
    marginHorizontal: wp(5),
  },
  socialButtonImage: {
    width: wp(7),
    height: wp(7),
  },
});
