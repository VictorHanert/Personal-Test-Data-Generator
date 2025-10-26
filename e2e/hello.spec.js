import { test, expect } from '@playwright/test';

test('test Hello btn', async ({ page }) => {
    await page.goto('http://localhost:8080/');

    // reference to the html element
    const output = page.getByTestId('output');

    await page.getByTestId('btn-hello').click();

    // wait for the output to change
    await expect(output).not.toHaveText("Click a button to call the API…");

    await expect(output).toContainText('Hello World!');
});