import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const customTheme = {
    dark: false,
    colors: {
        primary: '#FF9800', // Turuncu
        secondary: '#2C3E50', // Koyu mavi (footer rengi)
        background: '#FFF8E1', // Açık sarı/krem
        surface: '#FFFFFF',
        error: '#F44336',
        info: '#2196F3',
        success: '#4CAF50',
        warning: '#FFC107',
    },
}

export default createVuetify({
    components,
    directives,
    theme: {
        defaultTheme: 'customTheme',
        themes: {
            customTheme,
        },
    },
})