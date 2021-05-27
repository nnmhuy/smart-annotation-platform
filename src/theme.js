import { createMuiTheme } from "@material-ui/core"

export const theme = {
    light: {
        primaryColor: '#faf1e6',
        secondaryColor: '#ffc074',
        tertiaryColor: "#ffddb5",
        backgroundColor: '#f6f5f5',
        darkColor: 'black'
    }
}

export const themeMui = createMuiTheme(theme)