import { useEffect, useState } from 'react'

/*
https://gist.github.com/gragland/b61b8f46114edbcf2a9e4bd5eb9f47f5
?permalink_comment_id=4366045#gistcomment-4366045
*/

export const useKeyPress = (targetKey: string) => {
    const [keyPressed, setKeyPressed] = useState<boolean>(false)

    useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        function downHandler({ key }: any) {
            if (!keyPressed && key === targetKey) {
                setKeyPressed(true)

                setTimeout(() => {
                    setKeyPressed(false)
                }, 1000)
            }
        }

        window.addEventListener('keydown', downHandler)
        return () => {
            window.removeEventListener('keydown', downHandler)
        }
    }, [])

    return keyPressed
}

export const useKeyCombo = (keyCombo: string) => {
    const keys = keyCombo.split('+')
    const keyPresses = keys.map((key) => useKeyPress(key))

    return keyPresses.every((keyPressed) => keyPressed === true)
}

export const useOnKeyPressed = (keyCombo: string, onKeyPressed: () => void) => {
    const isKeyComboPressed = useKeyCombo(keyCombo)

    useEffect(() => {
        if (isKeyComboPressed) {
            onKeyPressed()
        }
    }, [isKeyComboPressed])
}
