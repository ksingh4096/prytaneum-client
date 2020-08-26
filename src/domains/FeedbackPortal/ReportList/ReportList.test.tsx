/* eslint-disable @typescript-eslint/require-await */
import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import ReactTestUtils from 'react-dom/test-utils';
import faker from 'faker';

import ReportList from './ReportList';
import * as API from '../api/api';
import { FeedbackForm } from '../types';

jest.mock('hooks/useSnack');

const recent = faker.date.recent();
const future = faker.date.future();

const ReportObject = {
    Report: {
        // Apperantly testing environment render html 4, which requires id attributes with a letter, hence the letter p at the beginning of the fake id
        _id: `p${faker.random.alphaNumeric(11)}`,
        date: faker.date.between(recent, future).toISOString(),
        description: faker.lorem.paragraph(),
        user: {
            _id: faker.random.alphaNumeric(11),
        },
    },
    submitEndpoint: (form: FeedbackForm) => API.updateFeedbackReport(form),
    deleteEndpoint: (_id: string) => API.deleteFeedbackReport(_id),
};

describe('CreateReportList', () => {
    let container: HTMLDivElement | null = null;
    beforeEach(() => {
        container = document.createElement('div');
        document.body.appendChild(container);
    });

    afterEach(() => {
        if (container) {
            unmountComponentAtNode(container);
            container.remove();
        }
        container = null;
        jest.restoreAllMocks();
    });

    // eslint-disable-next-line jest/expect-expect
    it('should render report list', async () => {
        ReactTestUtils.act(() => {
            render(<ReportList reportObjects={[ReportObject]} />, container);
        });
    });

    it('should render and open dialog', async () => {
        const newDescription = faker.lorem.paragraph();

        ReactTestUtils.act(() => {
            render(<ReportList reportObjects={[ReportObject]} />, container);
        });

        // Get form nodes
        const ListItemNode = document.querySelector(
            `#${ReportObject.Report._id}`
        ) as HTMLInputElement;

        // Open Dialog with Report Summary
        ReactTestUtils.act(() => {
            ListItemNode.dispatchEvent(
                new MouseEvent('click', { bubbles: true })
            );
        });

        // Get report description`
        const reportDescriptionNode = document.querySelector(
            '#reportDescription'
        ) as HTMLInputElement;

        expect(reportDescriptionNode.value).toBe(
            ReportObject.Report.description
        );

        // Update Report summary from the dialog
        ReactTestUtils.act(() => {
            ReactTestUtils.Simulate.change(reportDescriptionNode, {
                target: ({ value: newDescription } as unknown) as EventTarget,
            });
        });

        expect(reportDescriptionNode.value).toBe(newDescription);
    });
});
