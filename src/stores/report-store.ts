import { TablePaginationConfig } from 'antd';
import { makeAutoObservable } from 'mobx';
import { httpClient } from '../utils/http-client';
import { Parser } from 'json2csv';
import dayjs from 'dayjs';

export type Params = {
  productType: string;
  dates?: [Date, Date];
  month?: Date;
  isExport: boolean;
  loanType: string;
};

type PaginationParams = {
  page?: number;
  limit?: number;
};

type DataResponse = {
  docs: any[] | any;
  limit: number;
  page: 1;
  totalDocs: 0;
};

class ReportStore {
  reportSlug = '';

  data?: DataResponse;
  loading = false;
  params?: Params;
  paginationParams?: PaginationParams;

  parser = new Parser();

  get currentPagination(): TablePaginationConfig {
    return {
      current: this.data?.page,
      total: this.data?.totalDocs,
      pageSize: this.data?.limit,
    };
  }

  getRunningNumber(i: number) {
    if (!this.data) {
      return 0;
    }
    const { page = 1, limit = 20 } = this.data;
    return (page - 1) * limit + (i + 1);
  }

  constructor() {
    makeAutoObservable(this, {
      reportSlug: false,
      params: false,
      paginationParams: false,
      parser: false,
    });
  }

  init(reportSlug: string) {
    this.reportSlug = reportSlug;
    this.data = undefined;
  }

  setParams(params: Params) {
    this.params = params;
    this.execute();
  }

  setPaginationParams(tablePaginationConfig: TablePaginationConfig) {
    const { current, pageSize } = tablePaginationConfig;
    this.paginationParams = {
      page: current,
      limit: pageSize,
    };
    this.execute();
  }

  private execute() {
    if (this.params?.isExport) {
      this.exportData();
      this.params.isExport = false;
    } else {
      this.setData();
    }
  }

  private *getReport(): Generator<any> {
    try {
      this.loading = true;
      const res: any = yield httpClient.get('/reports', {
        params: {
          ...{
            ...this.params,
            dates: undefined,
            month: undefined,
            ...(this.params?.dates && {
              startDate: this.params.dates[0].toISOString(),
              endDate: this.params.dates[1].toISOString(),
            }),
            ...(this.params?.month && {
              startDate: dayjs(this.params.month)
                .startOf('month')
                .toISOString(),
              endDate: dayjs(this.params.month).endOf('month').toISOString(),
            }),
          },
          ...(!this.params?.isExport && this.paginationParams),
          report: this.reportSlug,
        },
      });

      return res.data;
    } finally {
      this.loading = false;
    }
  }

  private *setData() {
    this.data = yield this.getReport();
  }

  private *exportData(): Generator<any> {
    const data: any = yield this.getReport();
    const csv = this.parser.parse(data.docs);
    const blob = new Blob([csv], { type: 'text/csv' });
    const downloadLink = document.createElement('a');
    downloadLink.href = window.URL.createObjectURL(blob);
    downloadLink.setAttribute('download', 'export.csv');
    document.body.appendChild(downloadLink);
    downloadLink.click();
  }
}

export const reportStore = new ReportStore();
