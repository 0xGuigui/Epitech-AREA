import { withTheme } from 'react-native-paper';
import {View} from "react-native";
const Test = ({ theme,children }) => {
    const { colors } = theme;
    return (
        <View style={{ backgroundColor: colors.background }}>
            {children}
        </View>
    );
};

export default withTheme(Test);
