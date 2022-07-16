import {Box, Button, Stack} from "@chakra-ui/react"

export function Pagination() {
    return (
        <Stack
            direction="row"
            mt={8}
            justify="space-between"
            spacing="6"
            align="center"
        >
            <Box>
                <strong>0</strong> - <strong>10</strong> de <strong>100</strong>
            </Box>
            <Stack direction="row" spacing="6">
                <Button
                    size="sm"
                    fontSize="xs"
                    width="4"
                    colorScheme="pink"
                    disabled
                    _disabled={{
                        bgColor: "pink.500",
                        cursor: "default",
                    }}
                />
                <Button
                    size="sm"
                    fontSize="xs"
                    width="4"
                    bg="gray.700"
                    _hover={{bg: "gray.500"}}
                />
            </Stack>
        </Stack>
    )
}
