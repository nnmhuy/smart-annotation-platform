import { createMuiTheme } from "@material-ui/core"

export const theme = {
    light: {
        primaryColor: '#276678',
        secondaryColor: '#f6f5f5',
        backgroundColor: '#f6f5f5',
        darkColor: 'black'
    }
}

export const themeMui = createMuiTheme(theme)