package com.ihsinformatics.aahung.fragments;

import androidx.recyclerview.widget.RecyclerView;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Filter;
import android.widget.Filterable;
import android.widget.TextView;

import com.ihsinformatics.aahung.R;
import com.ihsinformatics.aahung.common.UserContract;
import com.ihsinformatics.aahung.model.BaseItem;

import java.util.ArrayList;
import java.util.List;


public class UserRecyclerViewAdapter extends RecyclerView.Adapter<UserRecyclerViewAdapter.ViewHolder> implements Filterable {

    private List<BaseItem> mValues;
    private List<BaseItem> mValuesFiltered;
    private final UserContract.AdapterInteractionListener mListener;

    public UserRecyclerViewAdapter(List<? extends BaseItem> items, UserContract.AdapterInteractionListener listener) {
        mValues = (List<BaseItem>) items;
        mValuesFiltered = (List<BaseItem>) items;
        mListener = listener;
    }

    @Override
    public ViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext())
                .inflate(R.layout.fragment_user, parent, false);
        return new ViewHolder(view);
    }

    @Override
    public void onBindViewHolder(final ViewHolder holder, final int position) {
        holder.mItem = mValuesFiltered.get(position);
        holder.id.setText(""+mValuesFiltered.get(position).getID());
        holder.name.setText(mValuesFiltered.get(position).getName());
       // holder.type.setText(mValuesFiltered.get(position).getType());

        holder.mView.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if (null != mListener) {
                    mListener.onUserSelected(holder.mItem,position);
                }
            }
        });
    }

    public void removeAt(int position) {
        mValuesFiltered.remove(position);
        notifyItemRemoved(position);
        notifyItemRangeChanged(position, mValuesFiltered.size());
    }

    @Override
    public int getItemCount() {
        return mValuesFiltered.size();
    }

    public void addUser(BaseItem mUser) {
        mValuesFiltered.add(mUser);
        notifyDataSetChanged();
    }


    public class ViewHolder extends RecyclerView.ViewHolder {
        public final View mView;
        public final TextView id;
        public final TextView name;
        public BaseItem mItem;

        public ViewHolder(View view) {
            super(view);
            mView = view;
            id = (TextView) view.findViewById(R.id.id);
            name = (TextView) view.findViewById(R.id.name);
        }

        @Override
        public String toString() {
            return super.toString() + " '" + name.getText() + "'";
        }
    }


    @Override
    public Filter getFilter() {
        return new Filter() {
            @Override
            protected FilterResults performFiltering(CharSequence charSequence) {
                String charString = charSequence.toString();
                if (charString.isEmpty()) {
                    mValuesFiltered = mValues;
                } else {
                    List<BaseItem> filteredList = new ArrayList<>();
                    for (BaseItem row : mValues) {

                        if (row.getName().toLowerCase().contains(charString.toLowerCase()) || String.valueOf(row.getID()).contains(charSequence)) {
                            filteredList.add(row);
                        }
                    }

                    mValuesFiltered = filteredList;
                }

                FilterResults filterResults = new FilterResults();
                filterResults.values = mValuesFiltered;
                return filterResults;
            }

            @Override
            protected void publishResults(CharSequence charSequence, FilterResults filterResults) {
                mValuesFiltered = (ArrayList<BaseItem>) filterResults.values;
                notifyDataSetChanged();
            }
        };
    }


}
