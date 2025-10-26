import { test, expect } from '@playwright/test';

test('test nameDob gen btn', async ({ page }) => {
    await page.goto('http://localhost:8080/');

    // reference to the html element
    const output = page.getByTestId('output');

    await page.getByTestId('btn-name-gender-dob').click();


    // wait for the output to change
    await expect(output).not.toHaveText("Click a button to call the API…");

    // Get the output text
    const outputText = await output.textContent();

    const data = JSON.parse(outputText);

    // Check that firstName and lastName start with an uppercase letter
    expect(data.firstName).toMatch(/^[A-Z]/);
    expect(data.lastName).toMatch(/^[A-Z]/);

    // Check that gender is either "female" or "male"
    expect(['female', 'male']).toContain(data.gender);

    // Check that birthDate matches yyyy-mm-dd
    expect(data.birthDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
});