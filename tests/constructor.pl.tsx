import { test, expect, Page } from '@playwright/test';

const BASE_URL = 'http://127.0.0.1:4000';

const bun = {
  id: '643d69a5c3f7b9001cfa093c',
  name: 'Краторная булка N-200i'
};

const filling = {
  id: '643d69a5c3f7b9001cfa0941',
  name: 'Биокотлета из марсианской Магнолии'
};

const getIngredientCard = (page: Page, ingredientName: string) =>
  page.locator('li').filter({
    has: page.getByText(ingredientName, { exact: true })
  });

const addIngredient = async (page: Page, ingredientName: string) => {
  const card = getIngredientCard(page, ingredientName);

  await card.getByRole('button', { name: 'Добавить' }).click();
};

test.describe('Конструктор бургера', () => {
  test.describe('Работа с ингредиентами', () => {
    test.beforeEach(async ({ page }) => {
      await page.routeFromHAR('./tests/hars/ingredients.har', {
        url: '**/api/ingredients'
      });

      await page.goto('/');

      await expect(page.locator('main')).toBeVisible({
        timeout: 15_000
      });
    });

    test('загружает ингредиенты из HAR-файла', async ({ page }) => {
      await expect(page.getByText(bun.name, { exact: true })).toBeVisible();

      await expect(page.getByText(filling.name, { exact: true })).toBeVisible();
    });

    test('добавляет булку и начинку в конструктор', async ({ page }) => {
      await addIngredient(page, bun.name);
      await addIngredient(page, filling.name);

      // булка находится в списке, сверху и снизу конструктора
      await expect(page.getByText(bun.name, { exact: false })).toHaveCount(3);

      // начинка находится в списке и конструкторе
      await expect(page.getByText(filling.name, { exact: true })).toHaveCount(
        2
      );
    });

    test('открывает данные выбранного ингредиента и закрывает окно крестиком', async ({
      page
    }) => {
      const modalRoot = page.locator('#modals');

      await page.getByText(bun.name, { exact: true }).click();

      await expect(page).toHaveURL(new RegExp(`/ingredients/${bun.id}$`));

      await expect(
        modalRoot.getByText(bun.name, { exact: true })
      ).toBeVisible();

      // калории и белки выбранной булки
      await expect(modalRoot.getByText('420', { exact: true })).toBeVisible();

      await expect(modalRoot.getByText('80', { exact: true })).toBeVisible();

      await modalRoot.locator('button').click();

      await expect(
        modalRoot.getByText(bun.name, { exact: true })
      ).not.toBeVisible();

      await expect(page).toHaveURL(`${BASE_URL}/`);
    });

    test('закрывает модальное окно ингредиента по клику на оверлей', async ({
      page
    }) => {
      const modalRoot = page.locator('#modals');

      await page.getByText(bun.name, { exact: true }).click();

      await expect(
        modalRoot.getByText(bun.name, { exact: true })
      ).toBeVisible();

      const overlay = modalRoot.locator(':scope > div').last();

      await overlay.click({
        position: { x: 5, y: 5 }
      });

      await expect(
        modalRoot.getByText(bun.name, { exact: true })
      ).not.toBeVisible();

      await expect(page).toHaveURL(`${BASE_URL}/`);
    });
  });

  test.describe('Создание заказа', () => {
    test('оформляет заказ, показывает его номер и очищает конструктор', async ({
      page,
      context
    }) => {
      await context.addCookies([
        {
          name: 'accessToken',
          value: 'mock-access-token',
          url: BASE_URL
        }
      ]);

      await page.addInitScript(() => {
        localStorage.setItem('refreshToken', 'mock-refresh-token');
      });

      await page.routeFromHAR('./tests/hars/ingredients.har', {
        url: '**/api/ingredients'
      });

      await page.routeFromHAR('./tests/hars/user.har', {
        url: '**/api/auth/user'
      });

      await page.routeFromHAR('./tests/hars/order.har', {
        url: '**/api/orders'
      });

      const userResponsePromise = page.waitForResponse('**/api/auth/user');

      await page.goto('/');
      await userResponsePromise;

      await expect(page.locator('main')).toBeVisible({
        timeout: 15_000
      });

      await addIngredient(page, bun.name);
      await addIngredient(page, filling.name);

      // начинаем ожидать запрос до клика
      const orderRequestPromise = page.waitForRequest(
        (request) =>
          request.url().endsWith('/api/orders') && request.method() === 'POST'
      );

      await page
        .getByRole('button', {
          name: 'Оформить заказ'
        })
        .click();

      const orderRequest = await orderRequestPromise;

      // проверяем токен и состав заказа
      expect(orderRequest.headers().authorization).toBe('mock-access-token');

      expect(orderRequest.postDataJSON()).toEqual({
        ingredients: [bun.id, filling.id, bun.id]
      });

      const modalRoot = page.locator('#modals');

      // проверяем открытие окна и номер заказа из order.har
      await expect(
        modalRoot.getByRole('heading', {
          name: '12345'
        })
      ).toBeVisible();

      await expect(page.getByText(bun.name, { exact: true })).toHaveCount(1);

      await expect(page.getByText(filling.name, { exact: true })).toHaveCount(
        1
      );

      // закрываем модальное окно заказа
      await modalRoot.locator('button').click();

      await expect(
        modalRoot.getByRole('heading', {
          name: '12345'
        })
      ).not.toBeVisible();
    });
  });
});
